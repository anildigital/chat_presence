defmodule ChatWeb.PageController do
  use ChatWeb, :controller

  alias Chat.Rooms
  alias Chat.Rooms.Room

  def index(conn, _params) do
    rooms = Rooms.rooms()

    render(conn, "index.html", rooms: rooms)
  end

  def get_room(conn, params) do
    room_id = params["room_id"]
    room = Rooms.get_room!(room_id)
    render(conn, "chat.html", room: room)
  end

  def new_room(conn, _params) do
    changeset = Rooms.change_room(%Room{})
    render(conn, "new_room.html", changeset: changeset)
  end

  def create_room(conn, params) do
    case Rooms.create_room(params["room"]) do
      {:ok, _room} ->
        conn
        |> put_flash(:info, "Post created successfully.")
        |> redirect(to: "/")

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new_room.html", changeset: changeset)
    end
  end
end
