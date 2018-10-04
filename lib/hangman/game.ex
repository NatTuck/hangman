defmodule Hangman.Game do
  def new do
    %{
      word: next_word(),
      guesses: MapSet.new(),
      players: %{},
    }
  end

  def new(players) do
    players = Enum.map players, fn {name, info} ->
      {name, %{ score: info.score || 0 }}
    end
    Map.put(new(), :players, Enum.into(players, %{}))
  end

  def default_player() do
    %{
      score: 0,
      guesses: MapSet.new(),
      cooldown: nil,
    }
  end

  def client_view(game, user) do
    ws = String.graphemes(game.word)
    gs = game.guesses
    %{
      skel: skeleton(ws, gs),
      goods: Enum.filter(gs, &(Enum.member?(ws, &1))),
      bads: Enum.filter(gs, &(!Enum.member?(ws, &1))),
      max: max_guesses(),
    }
  end

  def skeleton(word, guesses) do
    Enum.map word, fn cc ->
      if Enum.member?(guesses, cc) do
        cc
      else
        "_"
      end
    end
  end

  def guess(game, player, letter) do
    guesses = MapSet.put(game.guesses, letter)

    pinfo = Map.get(game, player, default_player())
    |> Map.update(:guesses, MapSet.new(), &(MapSet.put(&1, letter)))
    |> Map.put(:cooldown, :os.system_time(:milli_seconds) + 10_000)

    game
    |> Map.put(:guesses, guesses)
    |> Map.update(:players, %{}, &(Map.put(&1, player, pinfo)))
  end

  def max_guesses do
    10
  end

  def next_word do
    words = ~w(
      horse snake jazz violin
      muffin cookie pizza sandwich
      house train clock
      parsnip marshmallow
    )
    Enum.random(words)
  end
end
