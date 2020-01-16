defmodule Chat.Messages.Message do
  use Ecto.Schema
  import Ecto.Changeset

  schema "messages" do
    field :message, :string
    field :name, :string
    belongs_to :room, Chat.Rooms.Room

    timestamps()
  end

  @doc false
  def changeset(message, attrs) do
    message
    |> cast(attrs, [:name, :message, :room_id])
    |> validate_required([:name, :message, :room_id])
  end
end
