import React from 'react'
import {TsTest} from './ts-test/index'

export default ()=>{
  return <TsTest 
    options={[{name: '1', value: '1'}]} 
    value="1"
    onChange={item=> console.info(item)}
  />
}