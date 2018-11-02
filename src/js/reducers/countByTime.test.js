import reducer, {
  initialState,
  getCountByTimeData,
  formatHistogram
} from "./countByTime"
import * as a from "../actions/countByTime"

const reduce = actions => ({
  countByTime: actions.reduce(reducer, initialState)
})

test("receive data", () => {
  const data = {
    tuples: [["1"], ["2"]],
    descriptor: [{type: "integer", name: "count"}]
  }
  const state = reduce([a.requestCountByTime(), a.receiveCountByTime(data)])

  expect(getCountByTimeData(state)).toEqual(data)
})

test("receive data twice", () => {
  const data = {
    tuples: [["1"], ["2"]],
    descriptor: [{type: "integer", name: "count"}]
  }
  const state = reduce([
    a.requestCountByTime(),
    a.receiveCountByTime(data),
    a.receiveCountByTime(data)
  ])

  expect(getCountByTimeData(state)).toEqual({
    tuples: [["1"], ["2"], ["1"], ["2"]],
    descriptor: [{type: "integer", name: "count"}]
  })
})

test("#formatHistogram", () => {
  const timeWindow = [
    new Date("2017-09-18T03:29:23.074Z"),
    new Date("2018-05-18T14:47:15.016Z")
  ]
  const data = {
    descriptor: [
      {name: "ts", type: "time"},
      {name: "_path", type: "string"},
      {name: "count", type: "count"}
    ],
    tuples: [["1510185600000000000", "conn", "37179"]]
  }
  const result = formatHistogram(timeWindow, data)
  const sum = result.data.reduce((sum, d) => (sum += d.count), 0)
  expect(sum).toBe(37179)
  expect(result.keys).toEqual(["conn"])
})
