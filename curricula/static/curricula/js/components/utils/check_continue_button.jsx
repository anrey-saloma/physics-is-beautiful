import React from 'react'

export class CheckContinueButton extends React.Component {
  render () {
    return (
      <div className='button-group'>
        <a id='checkButton'
          className='btn btn-primary'
          onClick={this.props.isCheck ? this.props.checkAction : this.props.continueAction}>
          {this.props.isCheck ? 'Check' : 'Continue'}
        </a>
      </div>
    )
  }
}
CheckContinueButton.propTypes = {
  isCheck: React.PropTypes.bool,
  checkAction: React.PropTypes.func.isRequired,
  continueAction: React.PropTypes.func.isRequired
}
CheckContinueButton.defaultProps = {
  isCheck: true
}
