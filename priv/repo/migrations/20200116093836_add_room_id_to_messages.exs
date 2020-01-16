defmodule Chat.Repo.Migrations.AddRoomIdToMessages do
  use Ecto.Migration

  def change do
    alter table("messages") do
      add :room_id, references(:rooms)
    end
  end
end
