const encoder=new TextEncoder();
const crcTable=(()=>{const table=new Uint32Array(256);for(let i=0;i<256;i++){let value=i;for(let bit=0;bit<8;bit++)value=value&1?0xedb88320^(value>>>1):value>>>1;table[i]=value>>>0;}return table;})();
const crc32=bytes=>{let value=0xffffffff;for(const byte of bytes)value=crcTable[(value^byte)&255]^(value>>>8);return(value^0xffffffff)>>>0;};
const header=(size,write)=>{const bytes=new Uint8Array(size),view=new DataView(bytes.buffer);write(view);return bytes;};

export function zipStored(files){
 const local=[],central=[],records=[];let offset=0;
 for(const file of files){
  const path=String(file.path||'').replace(/^\/+|\.\.(?:\/|$)/g,'');if(!path)throw new Error('ZIP export needs a file path.');
  const name=encoder.encode(path),data=typeof file.content==='string'?encoder.encode(file.content):new Uint8Array(file.content),crc=crc32(data);
  const localHeader=header(30,view=>{view.setUint32(0,0x04034b50,true);view.setUint16(4,20,true);view.setUint16(6,0x0800,true);view.setUint16(8,0,true);view.setUint32(14,crc,true);view.setUint32(18,data.length,true);view.setUint32(22,data.length,true);view.setUint16(26,name.length,true);});
  local.push(localHeader,name,data);records.push({name,data,crc,offset});offset+=localHeader.length+name.length+data.length;
 }
 const centralOffset=offset;
 for(const record of records){const centralHeader=header(46,view=>{view.setUint32(0,0x02014b50,true);view.setUint16(4,20,true);view.setUint16(6,20,true);view.setUint16(8,0x0800,true);view.setUint16(10,0,true);view.setUint32(16,record.crc,true);view.setUint32(20,record.data.length,true);view.setUint32(24,record.data.length,true);view.setUint16(28,record.name.length,true);view.setUint32(42,record.offset,true);});central.push(centralHeader,record.name);offset+=centralHeader.length+record.name.length;}
 const centralSize=offset-centralOffset,end=header(22,view=>{view.setUint32(0,0x06054b50,true);view.setUint16(8,records.length,true);view.setUint16(10,records.length,true);view.setUint32(12,centralSize,true);view.setUint32(16,centralOffset,true);});
 return new Blob([...local,...central,end],{type:'application/zip'});
}
