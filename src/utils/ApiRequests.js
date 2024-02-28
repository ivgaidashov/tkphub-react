import {useState, useEffect} from 'react'
import axios from 'axios'

export default axios.create({
    withCredentials: true,
})