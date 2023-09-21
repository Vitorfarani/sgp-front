import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.scss'

const TextareaEditor = ({bounds = 3, ...props}) => {
  return (
    <ReactQuill
      bounds={bounds}
      style={{marginBottom: 60}}
     theme='snow'
      {...props}
    />
    )
}
export default TextareaEditor;