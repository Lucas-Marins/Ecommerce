import React from 'react';
import './Rating.css'

let rate = 0
function Rating({props}) {
  if(props.numReviews){
    rate = 100 - (props.rating / props.numReviews * 20)
}else{
    rate = 100 - (props.rating * 20)
}


  const style_star = {
    clipPath :props.rating === 0 ? `inset(0 0 0 0)` : `inset(0 ${rate}% 0 0)`
  }
  return (
    <div className="rating">
    <div className="start">
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>  
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>
        <i class="far fa-star"></i>

        <div className="start-1" style={style_star}> 
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        <i class="fas fa-star"></i>
        </div>
    </div>
 </div>
    );
}

export default Rating;