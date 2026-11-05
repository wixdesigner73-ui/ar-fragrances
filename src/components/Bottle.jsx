import React from 'react';
export default function Bottle({src,alt,imgRef,onLoad,className='',eager}){
 return <span className={'bottle '+className}><img ref={imgRef} onLoad={onLoad} className="b-img hbot" src={src} alt={alt} draggable="false" {...(eager?{fetchpriority:'high'}:{loading:'lazy'})}/><img className="b-refl" src={src} alt="" aria-hidden="true" draggable="false"/></span>}
