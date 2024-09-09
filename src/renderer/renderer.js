import {
  drawHex,
  drawHexByOwnCoordinates,
  drawOccupyingAnimal,
  drawHexOutlineByOwnCoordinates,
} from "./draw_hex"
import { config } from "./config"
import { isAdjacentToBoard } from "../cascadia"
import { animalExchangeButtonIfThree, createPlayerFieldButtonsForEachPlayer, createVictoryConditionButtons } from "./createButtons"

import { cards } from './victory_condition_cards'

let playerIDToRender = "0"
// eslint-disable-next-line no-unused-vars
export function render(state, ctx, resetOnClicks, client) {
  // remove everything
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, config.boardWidth, config.boardHeight)

  // draw ActivePlayer Label

  ctx.fillStyle = "black"
  ctx.font = "30px serif"
  ctx.textAlign = "center"
  ctx.fillText(
    `Field of Player: ${playerIDToRender}`,
    (config.boardWidth / 2-50) ,
    100
  )
  ctx.fillText(
    `You are Player: ${client.playerID}`,
    (config.boardWidth / 2-50) ,
    65
  )

  let chooseFromOfferingAndPlaceOnBoardState = {
    selectedOffering: null,
    newHexCoordinates: null,
  }

  const renderedHexCallback = (hex) => {
    if (hex.occupiedBy != null) return
    if (
      chooseFromOfferingAndPlaceOnBoardState.selectedOffering == null ||
      chooseFromOfferingAndPlaceOnBoardState.newHexCoordinates == null
    )
      return
    let selectedAnimal =
      state.G.offering[chooseFromOfferingAndPlaceOnBoardState.selectedOffering]
        .animal

    if (
      !hex.validAnimals.some(
        (item) => item.displayName == selectedAnimal.displayName
      )
    ) {
      alert("You killed your animal.")
      client.moves.chooseFromOfferingAndPlaceOnBoard(
        chooseFromOfferingAndPlaceOnBoardState.selectedOffering,
        chooseFromOfferingAndPlaceOnBoardState.newHexCoordinates,
        hex.rotation,
        hex.coordinates,
        false
      )
      client.events.endTurn()
      return
    }
    client.moves.chooseFromOfferingAndPlaceOnBoard(
      chooseFromOfferingAndPlaceOnBoardState.selectedOffering,
      chooseFromOfferingAndPlaceOnBoardState.newHexCoordinates,
      hex.rotation,
      hex.coordinates,
      true
    )
    client.events.endTurn()
  }

  resetOnClicks()
  //renders board on canvas
  for (let x = 0; x < state.G.boards[playerIDToRender].length; x++) {
    for (let y = 0; y < state.G.boards[playerIDToRender].length; y++) {
      if (state.G.boards[playerIDToRender][x][y] !== null) {
        drawHexByOwnCoordinates(
          ctx,
          state.G.boards[playerIDToRender][x][y],
          () => renderedHexCallback(state.G.boards[playerIDToRender][x][y])
        )
      } else if (isAdjacentToBoard(state.G.boards[playerIDToRender], [x, y])) {
        drawHexOutlineByOwnCoordinates(ctx, [x, y], () => {
          if (chooseFromOfferingAndPlaceOnBoardState.selectedOffering == null) {
            alert("No offering selected")
            return
          }
          if (
            chooseFromOfferingAndPlaceOnBoardState.newHexCoordinates != null
          ) {
            return
          }

          //copy object
          let newHex = JSON.parse(
            JSON.stringify(
              state.G.offering[
                chooseFromOfferingAndPlaceOnBoardState.selectedOffering
              ].cell
            )
          )
          //render new cell
          newHex.coordinates = [x, y]
          drawHexByOwnCoordinates(
            ctx,
            newHex,
            () => renderedHexCallback(newHex),
            true
          )
          chooseFromOfferingAndPlaceOnBoardState.newHexCoordinates =
            newHex.coordinates
        })
      }
    }
  }

  //renders Offering on canvas
  let dimension = 100

  for (let i = 0; i < 4; i++) {
    drawHex(ctx, state.G.offering[i].cell, 100 + i * dimension, 100, () => {
      if (
        state.ctx.currentPlayer == client.playerID &&
        state.ctx.currentPlayer == playerIDToRender
      ) {
        if (chooseFromOfferingAndPlaceOnBoardState.selectedOffering != null) {
          render(state, ctx, resetOnClicks, client)
        } else {
          chooseFromOfferingAndPlaceOnBoardState.selectedOffering = i
          ctx.beginPath()
          ctx.fillStyle = "rgba(150, 150, 150, 0.3)"
          ctx.rect(100 + i * dimension - config.hexRadius, 0, 100, 250)
          ctx.fill()
        }
      }
    })

    ctx.translate(100 + i * dimension, 200)
    drawOccupyingAnimal(ctx, state.G.offering[i].animal)
    ctx.translate(-(100 + i * dimension), -200)
  }

  // PlayerBoards choosing
  createPlayerFieldButtonsForEachPlayer(
    state.ctx,
    client.playerID,
    (player) => {
      playerIDToRender = player
      render(state, ctx, resetOnClicks, client)
    }
  )



  animalExchangeButtonIfThree(ctx, ()=>client.moves.changeAnimalOffering())


  for (let i = 0; i < cards.length; i++){
    createVictoryConditionButtons(ctx, i, ()=>render(state, ctx, resetOnClicks, client))
  }
}
