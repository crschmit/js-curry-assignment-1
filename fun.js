/**
 * @Author: Christian Schmitt
 * @Date:   2017-06-18T22:55:19-05:00
 * @Email:  crschmit@gmail.com
 * @Filename: fun.js
 * @Last modified by:   Christian Schmitt
 * @Last modified time: 2017-06-18T22:58:49-05:00
 */

'use strict'
 // A -> A
 const id = a => a

 // ((A, B) -> C) -> ((B, A) -> C)
 const swap = f => (b, a) => f(a, b)

 // (A -> B, [A]) -> [B]
 const map = (f, as) => as.map(f)
 // (A -> Bool, [A]) -> [A]
 const filter = (p, as) => as.filter(p)
 // ((B, A) => B, B, [A]) => B
 const foldL = (f, b, as) => as.reduce(f, b)
 const foldR = (f, b, as) => as.reduceRight(f, b)

 // (B -> C, A -> B) -> (A -> C)
 const compose2 = (f, g) => a => f(g(a))
 const compose = (...fs) => fs.reduceRight(swap(compose2), id)

 // (A -> B, B -> C) -> (A -> C)
 const chain2 = swap(compose2)
 const chain = (...fs) => fs.reduce(chain2, id)

 // (A -> B, A -> C, A) -> (B, C)
 const fork2 = (f, g, a) => [f(a), g(a)]

 // (A -> C, B -> D, (A, B)) -> (C, D)
 const bimap = (f, g, [a, b]) => [f(a), g(b)]

 // ((A, B) -> C) -> (A -> B -> C)
 const curry2 = f => a => b => f(a, b)
 const curry3 = f => a => b => c => f(a, b, c)

 // (A -> (B, ...) -> C) -> ((A, B, ...) -> C)
 const uncurry2 = f => (a, b) => f(a)(b)
 const uncurry3 = f => (a, b, c) => f(a)(b)(c)

 module.exports = {
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
 }
