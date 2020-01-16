defmodule Chat.Rooms do
  alias Chat.Repo
  alias Chat.Rooms.Room

  def rooms() do
    Repo.all(Room)
  end

  def get_room!(id) do
    Repo.get!(Room, id)
  end

  def change_room(%Room{} = room) do
    Room.changeset(room, %{})
  end

  def create_room(attrs \\ %{}) do
    %Room{}
    |> Room.changeset(attrs)
    |> Repo.insert()
  end
end
