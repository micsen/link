function strtoarr(str) {
  return new TextEncoder().encode(str)
}

function arrtostr(arr) {
  return new TextDecoder().decode(arr)
}

function salt() {
  var vector = new Uint8Array(16)
  crypto.getRandomValues(vector)
  return Array.from(vector)
}

function encrypt(txt, pas, slt, fnc) {
  var vector = new Uint8Array(slt)
  crypto.subtle.digest({ name: 'SHA-256' }, strtoarr(pas)).then((res) => {
    crypto.subtle.importKey('raw', res, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']).then((key) => {
      crypto.subtle.encrypt({ name: 'AES-CBC', iv: vector }, key, strtoarr(txt)).then((res) => {
        fnc(Array.from(new Uint8Array(res)), Array.from(vector))
      })
    })
  })
}

function decrypt(cyp, pas, slt, fnc) {
  var data = new Uint8Array(cyp)
  var vector = new Uint8Array(slt)
  crypto.subtle.digest({ name: 'SHA-256' }, strtoarr(pas)).then((res) => {
    crypto.subtle.importKey('raw', res, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']).then((key) => {
      crypto.subtle.decrypt({ name: 'AES-CBC', iv: vector }, key, data).then((res) => {
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
      salt: [212,93,164,60,57,184,49,58,155,251,91,72,13,6,161,35],
      data: [189,251,153,175,143,133,141,178,248,20,71,42,153,86,22,219,62,207,219,118,105,178,162,62,54,27,80,109,105,189,213,126,180,55,176,158,14,18,232,23,111,165,158,89,146,39,50,157,33,138,192,188,115,59,134,240,56,39,195,202,44,155,24,234,147,34,163,2,26,6,1,175,210,174,16,80,11,179,1,96,77,62,135,56,111,185,249,145,128,202,84,63,152,82,84,88,147,189,251,52,75,148,104,185,72,77,36,211,189,16,29,141,38,154,199,99,155,251,228,133,2,251,177,115,26,29,84,53,32,26,245,160,143,46,16,18,0,7,30,201,124,110,8,210,235,52,173,155,231,209,232,117,24,73,185,33,116,87,28,85,113,38,196,115,25,255,108,91,193,53,14,195,98,184,234,169,115,167,54,108,193,63,220,225,72,195,189,51,199,124,123,62,120,31,115,30,106,221,129,197,16,0,249,11,141,103,71,42,154,58,45,76,34,164,121,93,113,251,35,42,46,50,205,171,99,71,92,249,137,78,181,130,46,117,87,56,87,102,248,146,191,58,253,21,154,246,126,232,239,141,255,13,246,200,95,1,75,46,11,118,31,169,253,234,168,81,125,60,190,2,242,233,77,213,80,22,45,94,21,232,226,232,184,194,86,213,28,11,247,84,99,138,211,186,209,228,19,137,227,191,234,90,252,202,91,219,193,239,182,152,200,177,16,65,191,208,116,240,153,58,250,44,25,64,161,31,1,184,169,27,77,139,4,194,210,83,97,25,20,166,34,240,18,41,126,178,254,103,159,219,119,2,251,140,133,152,217,187,182,65,53,237,12,36,1,246,224,172,62,53,155,154,5,158,69,239,9,240,156,247,229,9,252,158,89,26,90,21,68,200,51,231,180,40,216,98,80,140,27,233,2,71,42,203,254,101,255,178,87,15,168,101,171,234,103,144,245,220,251,228,192,202,95,185,106,171,149,173,50,130,108,32,229,37,104,88,119,159,95,8,68,41,204,58,230,230,8,201,127,230,170,209,229,44,250,156,245,9,79,59,249,5,37,37,68,90,23,225,19,198,40,109,141,28,112,124,1,72,123,198,224,237,73,207,214,153,115,227,115,81,210,82,183,164,143,4,96,40,220,176,157,228,24,228,110,155,108,58,208,245,73,34,84,202,59,115,242,100,147,85,0,158,40,144,24,248,178,179,68,151,237,237,2,188,49,221,174,107,241,81,205,190,151,143,13,14,36,225,197,254,95,136,101,107,19,31,153,57,80,59,73,19,173,236,161,132,127,210,157,232,27,123,83,159,201,106,156,27,226,160,84,191,249,14,210,206,253,66,228,91,84,231,51,0,114,254,162,139,124,244,6,52,173,62,59,254,84,188,55,76,119,158,9,25,0,61,9,175,154,63,195,183,7,164,11,165,108,141,208,240,34,165,202,249,53,230,14,236,231,152,234,61,185,14,92,172,243,37,157,69,244,70,100,186,59,223]
    }
  }
}
window.onload = function () {
  try {
    // get query string
    var query = window.location.search.substring(1)
    // encrypt
    /*const clearText = JSON.stringify(links.private)
    encrypt(clearText, query, salt(), (ciphertext, salt) => {
        console.log(JSON.stringify(salt))
        const data = JSON.stringify(ciphertext);
        console.log(data)
    })*/

    //decrypt
    const key = query.split("=")[0]
    const enc = links.enc[key]
    decrypt(enc.data, query, enc.salt, (plaintext) => {
      console.log(plaintext)

      const links = JSON.parse(plaintext).links
      links.forEach((link) => {
        console.log(link)
        document.getElementById('links').innerHTML += `
                <a class="link" href="${link.link}" target="_blank">
                    <i class="${link.icon}">&nbsp;</i>${link.text}
                </a>`
      })
    })
  } catch (error) {
    document.getElementById('links').innerHTML += `
        <a class="link" id="github" href="#" target="_blank">
            <i class="fd">&nbsp;</i>Invalid Key
        </a>`
  }


}