var Comment = require( '../models/comment' )
var express = require( 'express' )
var router = express.Router()

router.route( '/comment/:feed_id' )
  .get( ( req, res ) => {
    Comment.find( { feed_id : req.params.feed_id } ).exec( ( err, comments ) => {
      if( err ) {
        return res.send( err )
      }
      res.json( comments )
    } )
  } )
  .post( ( req, res ) => {
    var reqBody = Object.assign( req.body, { feed_id : req.params.feed_id } )
    const comment = new Comment( Object.assign( req.body, { feed_id : req.params.feed_id } ) )
    comment.save( ( err, result ) => {
      if( err ) {
        return res.send( err )
      }
      // console.log('hehehehe', comment)
      res.send( comment )
    } )
  } )

module.exports = router
