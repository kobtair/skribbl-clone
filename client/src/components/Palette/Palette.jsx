import './palette.style.scss'
import colors from '../../data/colors'

export default function Palette() {
  return (
    <div className="palette-container">
        <div className="selected-color"></div>
        <div className="colors">
        {colors.map(color=><div key={color.id} style={{backgroundColor: color.value}} className='color'>&zwnj;</div>)}
        </div>
        <button></button>
    </div>
  )
}
