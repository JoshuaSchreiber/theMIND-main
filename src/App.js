

import { Client } from "boardgame.io/client"
import { Local, SocketIO } from "boardgame.io/multiplayer"
import { resetOnClicks, ctx } from "./canvas"
import { Debug } from "boardgame.io/debug"
import { Cascadia } from "./cascadia"
import { render } from "./renderer/renderer"
import { setupLobby } from "./lobby"

const isMultiplayer = import.meta.env.VITE_REMOTE === "true"
const multiplayerServer =
  import.meta.env.VITE_MUTLIPLAYER_SERVER ?? "localhost:8000"

const multiplayer = isMultiplayer
  ? SocketIO({ server: multiplayerServer })
  : Local()

class GameClient {
  constructor(rootElement, gameParams) {
    this.rootElement = rootElement

    this.client = Client({
      game: Cascadia,
      multiplayer: isMultiplayer ? multiplayer : undefined,
      debug: {
        collapseOnLoad: false,
        hideToggleButton: false,
        impl: Debug,
      },
      matchID: gameParams?.matchId,
      playerID: gameParams?.playerId,
      credentials: gameParams?.playerCredentials,
    })

    this.client.subscribe((state) => {
      if (state == null) return
      render(state, ctx, resetOnClicks, this.client)
    })
    this.client.start()
  }
}

setupLobby(
  isMultiplayer,
  (appElement, game) => new GameClient(appElement, game)
)
