defmodule Chat.Messages do
  import Ecto.Query

  def get_messages(room_id, limit \\ 20) do
    query = Chat.Messages.Message |> where(room_id: ^room_id)
    Chat.Repo.all(query)
  end
end
