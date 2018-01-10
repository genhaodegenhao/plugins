import React from 'react'
import { render } from 'react-dom'

// 通用样式
import './static/styles/common.scss'

import CheckAuth from './components/HOC/checkAuth';
render(
    <CheckAuth />,
    document.getElementById('root')
)