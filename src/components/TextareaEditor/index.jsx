import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.scss'

const TextareaEditor = (props) => {
  return (
    <ReactQuill
      bounds={3}
      style={{marginBottom: 60}}
     theme='snow'
      {...props}
    />
    )
}
export default TextareaEditor;