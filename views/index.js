let url = document.querySelector('#url')
let result = document.querySelector('.result')
let option = document.querySelector('#option')
let submit = document.querySelector('#submit')
let loading = document.querySelector('.loading')

submit.addEventListener('click',async(e)=>{
e.preventDefault()
result.innerHTML = ''
loading.style.display= 'block'
let data = new URLSearchParams({url: url.value,option: option.value})
console.log(data);

 let fdata = await fetch(`/pdf?`+data)
 let jdata = await fdata.json()
 
      result.innerHTML=''
      loading.style.display= 'none'
      if (jdata.success===true) {
        url.value = ''
        if (jdata.type==='pdf') {
        let blb = new Blob([new Uint8Array(jdata.pdf.data)],{type:'application/pdf'}) 
        let pdf = URL.createObjectURL(blb)
        let elem = document.createElement('a')
        elem.setAttribute('download',`${Date.now()}.pdf`)
        elem.href = pdf
        elem.click()   
    result.innerHTML = `<h2>Congratulations! Your Downloding has been started.</h2>`  
    }
        if (jdata.type==='image') {
            
        let blb = new Blob([new Uint8Array(jdata.image.data)],{type:'application/image'}) 
        let pdf = URL.createObjectURL(blb)
        let elem = document.createElement('a')
        elem.setAttribute('download',`${Date.now()}.jpg`)
        elem.href = pdf
        elem.click()
        const images =new Image()
        images.src=pdf
        result.appendChild(images)

    }
      }
      else{
        loading.style.display= 'none'
        result.innerHTML = `
        <h2>success: ${jdata.success}</h2>
        <p>Error: ${jdata.error.name}</p>
        `        
      }
      
    
    })


const showData=async(data)=>{
    if (data.success==true) {
        if (data.type == 'image') {
        let url = `/${data.type}${data.id}.jpg`
        const fd = await fetch(url)
        const blb = await fd.blob()
        const blburl = URL.createObjectURL(blb)
        let elem = document.createElement('a')
            elem.href = blburl
            elem.setAttribute('download',`downloadimage${url}`)
            elem.click()
            const img = new Image()
            img.src = blburl
        result.appendChild(img)
        }

        if (data.type == 'pdf') {
            let url = `/${data.type}${data.id}.pdf`
            const fd = await fetch(url)
            const blb = await fd.blob()
            const blburl = URL.createObjectURL(blb)
            let elem = document.createElement('a')
            elem.href = blburl
            elem.setAttribute('download',`downloadimage${url}`)
            elem.click()
        result.appendChild(elem)
        }
    }
    else{
        result.innerHTML = `
        <h2>success: ${data.success}</h2>
        <p>Error: ${data.error.name}</p>
        `
    }
}

