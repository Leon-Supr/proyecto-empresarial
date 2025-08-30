// import { useEffect, useState } from "react";

import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const Pagination = () => {
  const [pages, setPages] = useState([])

  useEffect(()=>{
    fetch("http://localhost:8000/search?num=5")
    .then(res => res.json())
    .then(data => setPages(data))
    .catch(err => console.error("Error:", err))
  }, [])

  return (
    <div>
      {pages}
    </div>
  )
}

export default Pagination
