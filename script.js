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
            salt: [193,24,49,147,20,127,3,153,77,250,15,226,247,182,192,64],
            data: [109,171,145,74,197,191,210,89,129,5,154,203,31,146,21,184,45,222,33,145,81,179,118,119,79,214,41,161,79,126,169,118,30,36,77,138,217,199,65,240,115,163,221,40,187,92,189,242,26,132,170,67,93,233,170,100,51,24,92,21,127,112,39,76,193,12,173,51,55,173,136,138,59,131,170,73,189,40,242,50,250,168,146,114,118,89,36,45,152,57,109,58,91,36,62,63,52,239,246,119,150,150,182,46,77,233,164,113,12,60,159,216,84,116,28,225,105,37,253,37,222,36,66,175,5,2,203,116,8,231,92,223,91,7,32,121,245,209,37,23,190,189,176,71,119,240,205,195,189,240,92,127,239,77,8,116,150,253,78,196,211,70,236,253,56,218,41,221,107,130,86,37,14,83,231,240,196,226,213,156,205,27,111,189,247,56,22,63,139,174,2,66,0,167,67,146,127,176,28,26,172,32,182,237,186,61,96,181,153,114,235,177,6,229,33,44,112,183,131,232,163,46,28,35,24,32,73,201,130,20,247,242,112,139,26,237,218,87,142,23,52,100,172,238,143,246,243,217,95,85,147,152,76,112,51,65,120,199,130,17,22,46,2,68,13,125,89,227,5,154,102,137,129,170,3,184,5,147,98,138,4,237,214,109,225,115,141,210,37,226,3,148,66,60,48,3,192,166,115,37,58,205,214,88,162,56,22,38,211,237,137,94,187,217,231,132,175,179,242,254,54,215,6,206,42,162,138,78,84,72,152,129,96,67,31,159,160,8,17,34,162,18,247,58,21,48,167,113,31,8,100,66]
        }
    }
  }
window.onload = function () {
    // get query string
    console.log(window.location.search)
    var query = window.location.search.substring(1)
    console.log(query)
    const clearText = JSON.stringify(links.private)
    // encrypt
/*    encrypt(clearText, query, salt(), (ciphertext, salt) => {
        console.log(JSON.stringify(salt))
        const data = JSON.stringify(ciphertext);
        console.log(data)
    })
*/
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