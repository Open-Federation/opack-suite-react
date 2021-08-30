import * as React from 'react';

interface OptionItem {
  name: string,
  value: string
}

interface TsTestProps {
  options: Array<OptionItem>,
  value: string,
  onChange: (value: string) => void
}

export function xx(a: number, b: number): boolean{
  if(a < b){
    return true;
  }
  return false;
}

// 箭头函数泛型写法
export const ArrowCase = <T1 extends object>(props: T1) =>{
  return <div {...props} />;
}

// 箭头函数组件
export const TsTest: React.FC<TsTestProps> = React.memo((props: TsTestProps) => {
  return <div>
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>
})

