/**
 * @Author: Christian Schmitt
 * @Date:   2017-06-11T08:38:18-05:00
 * @Email:  crschmit@gmail.com
 * @Filename: lib.js
 * @Last modified by:   Christian Schmitt
 * @Last modified time: 2017-06-18T22:59:33-05:00
 */

'use strict'
const {
  id,
  swap,
  map,
  filter,
  foldL,
  foldR,
  compose2,
  compose,
  chain2,
  chain,
  fork2,
  bimap,
  curry2,
  curry3,
  uncurry2,
  uncurry3
} = require('./fun.js')

// (String, Number) => Listing
const listing =
 (name, price) => ({
   name,
   price
 })

 const getName = ({ name }) => name
 const getPrice = ({ price }) => price

// Listing -> (String, Number)
const listingPair = curry3(fork2)(getName)(getPrice)

// (String, [String]) => Cart
const cart =
 (customer, ...items) => ({
   customer,
   items
 })

const getCustomer = ({ customer }) => customer
const getItems = ({ items }) => items

// Cart -> (String, String[])
const cartPair = curry3(fork2)(getCustomer)(getItems)

// // Listing -> String -> Number
const listedPrice =
 listing =>
   name =>
     name === listing.name
       ? listing.price
       : 0

// // [Listing] -> [String -> Number]
const listings2priceFNs = curry2(map)(listedPrice)
// // [String -> Number] -> String -> Number
const priceFNs2priceFN = pfs => s => {
  let price = map(f => f(s), pfs).find(p => p > 0)
  return (price != null) ? price : 0
}
// // [Listing] -> (String -> Number)
const listings2priceFN = chain(
  listings2priceFNs,
  priceFNs2priceFN
)

// // (String -> Number) -> { String, [String] } -> (String, [Number])
const cartPriceCheck = pricefn =>
  ct => {
    let cpair = cartPair(ct),
        ppair = bimap(id, curry2(map)(pricefn), cpair)
    return ppair
  }
// // (String, [Number]) -> (String, Number)
const cartTotal =
  curry3(bimap)(id)(curry3(foldL)((a, b) => a + b)(0))

// (String -> Number) -> Cart -> (String, Number)
const getCartTotal = pf => chain(
  cartPriceCheck(pf),
  cartTotal
)

// (String -> Number) -> [Cart] -> [(String, Number)]
const getCartsTotals = pf => curry2(map)(getCartTotal(pf))

// (String, Number) -> { String, Number }
const formatTotal = tp => ({ customer: tp[0], total: tp[1] })
// [(String, Number)] -> [{ String, Number }]
const formatTotals = curry2(map)(formatTotal)

/**
* transform carts into an array of { customer, total }
*/

// [{ name: String, price: Number }] ->
//    [{ customer: String, items: [String] }] ->
//        [{ customer: String, price: Number }]
// i.e. [Listing] -> [Cart] -> [Cart']
const calculateTotals = lss => cts => {
  let pf = listings2priceFN(lss)
  let cttotals = getCartsTotals(pf)(cts)
  return formatTotals(cttotals)
}

module.exports = {
 listing,
 cart,
 calculateTotals
}
