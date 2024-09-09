import {
  isAdjacentToBoard,
  isAdjacent,
  getNeighbourCoordinates,
} from "../cascadia"
export function scoring() {}

export function getNeighbourAnimals(board, coordinates) {
  let neighbourCoordinates = getNeighbourCoordinates(coordinates)
  let animals = []
  for (let nC of neighbourCoordinates) {
    if (board[nC[0]][nC[1]] == null) continue
    if (board[nC[0]][nC[1]].occupiedBy != null) {
      animals.push(board[nC[0]][nC[1]].occupiedBy)
    }
  }

  return animals
}

export function getNeighbourAnimalsOfType(board, coordinates, displayName) {
  let result = []
  let neighbourCoordinates = getNeighbourCoordinates(coordinates)
  for (let nC of neighbourCoordinates) {
    const [x, y] = nC
    if (board[x][y] == null) continue
    if (board[x][y].occupiedBy == null) continue
    if (board[x][y].occupiedBy.displayName.toString() == displayName) {
      result.push(nC)
    }
  }
  return result
}

export function countAnimalList(list) {
  let counts = {}
  for (let animal of list) {
    if (counts[animal.displayName] == undefined) {
      counts[animal.displayName] = 0
    }
    counts[animal.displayName] += 1
  }
  return counts
}

export function addCoordsToListIfNotAlreadyInList(list, coords) {
  for (let item of list) {
    if (item[0] == coords[0] && item[1] == coords[1]) {
      return
    }
  }
  list.push(coords)
  return list
}
export function cordsInCordsList(coords, coordsList) {
  return coordsList.some((item) => item[0] == coords[0] && item[1] == coords[1])
}

export function countLongestSequence(list, validation) {
  for (let i = list.length; i >= 0; i--) {
    for (let j = 0; j <= list.length - i; j++) {
      for (let n = j; n < j + i; n++) {
        if (!validation(list[n])) break
        return i
      }
    }
  }
  return 0
}
