defmodule ChatWeb.RoomChannel do
  use ChatWeb, :channel

  def join("room:" <> room_id, payload, socket) do
    if authorized?(payload) do
      send(self(), :after_join)
      {:ok, assign(socket, :room_id, room_id)}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  def handle_in("message:add", payload, socket) do
    room_id = socket.assigns[:room_id]
    payload = Map.put(payload, "room_id", room_id)
    Chat.Messages.Message.changeset(%Chat.Messages.Message{}, payload) |> Chat.Repo.insert()
    broadcast(socket, "room:#{room_id}:new_message", payload)
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    room_id = socket.assigns[:room_id]

    Chat.Messages.get_messages(room_id)
    |> Enum.each(fn msg ->
      push(socket, "room:#{room_id}:new_message", %{
        name: msg.name,
        message: msg.message
      })
    end)

    # :noreply
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
