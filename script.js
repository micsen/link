function strtoarr (str) {
    return new TextEncoder().encode(str)
  }
  
  function arrtostr (arr) {
    return new TextDecoder().decode(arr)
  }
  
  function salt() {
    var vector = new Uint8Array(16)
    crypto.getRandomValues(vector)
    return Array.from(vector)
  }
  
  function encrypt (txt, pas, slt, fnc) {
    var vector = new Uint8Array(slt)
    crypto.subtle.digest({name: 'SHA-256'}, strtoarr(pas)).then((res) => {
      crypto.subtle.importKey('raw', res, {name: 'AES-CBC'}, false, ['encrypt', 'decrypt']).then((key) => {
        crypto.subtle.encrypt({name: 'AES-CBC', iv: vector}, key, strtoarr(txt)).then((res) => {
          fnc(Array.from(new Uint8Array(res)), Array.from(vector))
        })
      })
    })
  }
  
  function decrypt (cyp, pas, slt, fnc) {
    var data = new Uint8Array(cyp)
    var vector = new Uint8Array(slt)
    crypto.subtle.digest({name: 'SHA-256'}, strtoarr(pas)).then((res) => {
      crypto.subtle.importKey('raw', res, {name: 'AES-CBC'}, false, ['encrypt', 'decrypt']).then((key) => {
        crypto.subtle.decrypt({name: 'AES-CBC', iv: vector}, key, data).then((res) => {
          fnc(arrtostr(res))
        }, () => {
          fnc(null)
        })
      })
    })
  }


  const links = {
    enc: {
        private: {
            salt: [247,92,217,194,1,64,98,89,133,206,140,13,19,71,76,92],
            data: [102,239,62,231,107,149,189,233,157,245,56,9,72,191,183,7,156,247,113,61,143,91,119,143,19,124,6,182,183,172,53,81,22,32,248,108,110,236,125,177,255,128,34,173,170,230,68,176,183,103,235,150,101,191,226,15,76,205,169,254,126,81,115,28,215,144,191,9,127,39,159,36,18,123,49,223,227,23,179,171,24,194,129,156,88,159,81,217,75,19,243,243,55,34,110,183,219,137,159,167,231,57,110,44,55,119,2,243,110,183,5,51,71,218,203,131,8,36,203,243,30,0,224,30,128,110,195,103,42,45,52,236,62,231,44,64,148,152,25,130,160,36,198,194,100,161,241,24,49,93,97,60,46,211,25,234,204,170,172,177,224,203,97,250,177,56,253,10,244,31,174,233,34,56,46,94,136,130,8,114,237,30,152,132,87,204,163,2,185,20,199,172,252,68,70,145,10,120,163,128,161,42,25,190,36,247,15,142,68,89,22,8,27,234,46,131,207,16,44,46,16,120,15,143,89,102,239,202,7,11,241,235,100,67,213,113,155,173,216,52,202,118,204,146,67,95,24,140,191,176,52,21,132,30,236,99,121,104,139,141,42,47,4,101,88,230,10,198,144,96,120,61,83,73,42,101,237,138,31,116,118,98,2,33,122,201,159,121,129,217,14,140,72,159,144,239,20,153,212,48,38,84,22,11,89,92,161,85,101,98,145,140,59,93,227,214,182,206,52,138,88,105,152,128,49,135,155,21,24,11,167,89,217,203,134,254,77,186,100,29,179,51,90,31,22,168,6,166,142,249,7,67,140,70,73,178,137,23,167,106,82,204,68,211,59,68,49,141,212,102,32,238,13,110,167,63,255,199,60,229,169,177,193,223,208,37,73,235,214,232,236,118,35,135,120,15,178,65,6,228,72,189,31,163,21,238,89,159,192,130,220,181,90,116,42,126,168,205,169,22,92,199,146,58,200,135,173,249,168,85,72,0,61,178,66,175,32,140,80,123,82,90,240,211,74,16,143,130,17,89,206,192,153,239,108,28,125,112,200,124,172,84,213,67,53,98,209,56,1,54,148,11,141,238,237,133,173,238,16,9,89,26,249,188,150,3,215,183,250,215,10,219,196,194,67,83,62,125,147,105,223,120,141,236,95,57,157,78,205,90,195,165]
        }
    }
  }
window.onload = function () {
    // get query string
    var query = window.location.search.substring(1)
    // encrypt
    const clearText = JSON.stringify(links.private)
    encrypt(clearText, query, salt(), (ciphertext, salt) => {
        console.log(JSON.stringify(salt))
        const data = JSON.stringify(ciphertext);
        console.log(data)
    })

    //decrypt
    const key = query.split("=")[0]
    const enc = links.enc[key]
    decrypt(enc.data, query, enc.salt, (plaintext) => {
        console.log(plaintext)
        try {
            const links = JSON.parse(plaintext).links
            links.forEach((link) => {
                console.log(link)
                document.getElementById('links').innerHTML += `
                <a class="link" href="${link.link}" target="_blank">
                    <i class="${link.icon}">&nbsp;</i>${link.text}
                </a>`
            })
        } catch (error) {
            document.getElementById('links').innerHTML += `
                <a class="link" id="github" href="#" target="_blank">
                    <i class="fd">&nbsp;</i>Invalid Key
                </a>`
        }
    })


}