defmodule HangmanWeb.GamesChannel do
  use HangmanWeb, :channel

  alias Hangman.GameServer

  def join("games:" <> game, payload, socket) do
    if authorized?(payload) do
      socket = assign(socket, :game, game)
      view = GameServer.view(game, socket.assigns[:user])
      {:ok, %{"join" => game, "game" => view}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("guess", %{"letter" => ll}, socket) do
    view = GameServer.guess(socket.assigns[:game], socket.assigns[:user], ll)
    {:reply, {:ok, %{ "game" => view}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
