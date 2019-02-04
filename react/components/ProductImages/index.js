import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { path } from 'ramda'
import debounce from 'debounce'
import Video from './components/Video'

import Carousel from './components/Carousel'

class ProductImages extends Component {
  componentDidMount() {
    window.addEventListener('resize', this.debouncedGetBestUrl)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedGetBestUrl)
  }

  debouncedGetBestUrl = debounce(this.forceUpdate, 500)

  getBestUrlIndex = thresholds => {
    const windowSize = window.innerWidth

    let bestUrlIndex = 0
    thresholds.forEach((threshold, i) => {
      if (windowSize > threshold) bestUrlIndex = i + 1
    })

    return bestUrlIndex
  }

  get slides() {
    const { images } = this.props
    
    console.log('images', images)
    if (images.length === 0) return
    return images.map(image => { 
      return {
        type: Video.isVideo(image.imageUrls[0]) ? 'video':'image',
        urls: image.imageUrls,
        alt: image.imageText,
        thumbUrl: image.thumbnailUrl || image.imageUrls[0],
        bestUrlIndex: this.getBestUrlIndex(image.thresholds),
      }
    })
  }

  render() {
    const objAux = {
      type: 'video',
      urls: ['https://vimeo.com/71336599'],
      alt: 'Frame Test',
      bestUrlIndex: this.getBestUrlIndex([640]),
      thumbUrl: 'https://vimeo.com/71336599',
      thumbWidth: 640
    }
    console.log(this.slides)
    return (
      <div className="w-100">
        <Carousel slides={this.slides} />
      </div>
    )
  }
}

ProductImages.propTypes = {
  /** Array of images to be passed for the Thumbnail Slider component as a props */
  images: PropTypes.arrayOf(
    PropTypes.shape({
      /** URL of the image */
      imageUrls: PropTypes.arrayOf(PropTypes.string.isRequired),
      /** Size thresholds used to choose each image */
      thresholds: PropTypes.arrayOf(PropTypes.number),
      /** URL of the image thumbnail */
      thumbnailUrl: PropTypes.string,
      /** Text that describes the image */
      imageText: PropTypes.string.isRequired,
    }),
  ),
}

ProductImages.defaultProps = {
  images: [],
}

export default ProductImages
