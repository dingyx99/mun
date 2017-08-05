import React from 'react';
import ReactDOM from 'react-dom';
import AV from 'leancloud-storage';
import './index.css';
import App from './App';


AV.init({
  appId: 'Ax45OVE0NFB9454z6mIFH62v-gzGzoHsz',
  appKey: '7PypQLuuPqgruQuMqufACvgO'
})

ReactDOM.render( < App / > , document.getElementById('root'));