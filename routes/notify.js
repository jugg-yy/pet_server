var Notify = require( '../models/notify' )
var express = require( 'express' )
var router = express.Router()

router.route( '/notify/unread/:receiver' )
  .get( ( req, res ) => {
    Notify.findOne( { receiver : req.params.receiver } ).exec( ( err, notifies ) => {
      if( err ) {
        return res.send( err )
      }
      var result = []
      if( notifies ) {
        notifies.notifies.forEach( ( notify ) => {
          notify.readed === 0 && result.unshift( notify )
        } )
      } else {
        result = []
      }
      res.json( result )
    } )
  } )

router.route( '/notify/read/:receiver/:notify_id' )
  .put( ( req, res ) => {
    Notify.findOne( { receiver : req.params.receiver }, ( err, notifies ) => {
      if( err ){
        return res.send( err )
      }
      if( notifies ) {
        for( var i = 0, len = notifies.notifies.length; i < len; i++ ) {
          // console.log( notifies.notifies[ i ].id === req.params.notify_id )
          if( notifies.notifies[ i ].id === req.params.notify_id ) {
            notifies.notifies[ i ].readed = 1// = Object.assign( notifies.notifies[ i ], { readed : 1 } )
            break
          }
        }
      }
      // notifies.notifies = notifies.notifies.slice()
      const result = notifies.notifies.slice()
      notifies.notifies = []
      result.forEach( function( item ) {
        notifies.notifies.push( item )
      } )

      // for( prop in req.body ){
      //   feed[ props ] = req.body[ props ]
      // }
      // console.log( notifies.notifies )
      notifies.save( ( err ) => {
        if( err ){
          return res.send( err )
        }
        res.json( { message : 'Notifies updated.' } )
      } )

    } )
  } )


router.route( '/notify/unread/count/:receiver' )
  .get( ( req, res ) => {
    Notify.findOne( { receiver : req.params.receiver } ).exec( ( err, notifies ) => {
      if( err ) {
        return res.send( err )
      }
      var result = 0
      if( notifies ) {
        notifies.notifies.forEach( ( notify ) => {
          notify.readed === 0 && result++
        } )
      }
      res.json( { unread : result } )
    } )
  } )

router.route( '/notify/:receiver' )
  // 获取全部 notifies
  .get( ( req, res ) => {
    Notify.findOne( { receiver : req.params.receiver } ).exec( ( err, notifies ) => {
      if( err ) {
        return res.send( err )
      }
      res.json( notifies || [] )
    } )
  } )
  // 提交一个 notify
  .post( ( req, res ) => {
    // console.log( req.body )
    Notify.findOne( { receiver : req.params.receiver }, ( err, notifies ) => {
      if( err ){
        return res.send( err )
      }

      req.body.notifies[ 0 ].id = new Date().getTime() + '_' + Math.random()

      if( ! notifies ){
        const notifies = new Notify( req.body )

        notifies.save( ( err ) => {
          if( err ) {
            return res.send( err )
          }

          res.json( { message : 'Notify added.' } )

        } )
      } else {

        notifies.notifies.push( req.body.notifies[0] )
        notifies.save( ( err ) => {
          if( err ){
            return res.send( err )
          }
          res.json( { message : 'Notify updated.' } )

        } )
      }

    } )
  } )

  module.exports = router
