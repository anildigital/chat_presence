defmodule ChatWeb.Router do
  use ChatWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug ChatWeb.Plugs.FetchUser
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ChatWeb do
    pipe_through :browser

    get "/", PageController, :index

    get("/sign-in", SessionController, :new)
    post("/sign-in", SessionController, :create)
    delete("/sign-out", SessionController, :delete)

    get("/register", RegistrationController, :new)
    post("/register", RegistrationController, :create)

    get("/rooms/new", PageController, :new_room)
    get("/rooms/:room_id", PageController, :get_room)

    post("/rooms/create", PageController, :create_room)
  end

  # Other scopes may use custom stacks.
  # scope "/api", ChatWeb do
  #   pipe_through :api
  # end
end
