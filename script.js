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
      salt: [255, 171, 1, 167, 157, 107, 52, 187, 99, 100, 124, 12, 215, 237, 117, 57],
      data: [168, 196, 10, 237, 124, 41, 45, 234, 129, 102, 63, 24, 217, 164, 218, 205, 225, 82, 120, 156, 138, 77, 24, 168, 142, 101, 85, 30, 106, 252, 99, 209, 104, 41, 235, 132, 245, 53, 109, 195, 180, 186, 39, 231, 27, 120, 129, 177, 95, 78, 23, 251, 44, 76, 232, 140, 73, 181, 232, 179, 242, 62, 8, 216, 189, 37, 117, 7, 49, 8, 120, 164, 51, 175, 220, 133, 67, 76, 150, 89, 136, 32, 111, 82, 125, 239, 65, 42, 196, 83, 216, 236, 35, 178, 188, 137, 216, 218, 230, 99, 65, 81, 235, 147, 27, 213, 93, 237, 237, 105, 230, 198, 247, 71, 219, 25, 8, 122, 34, 112, 30, 63, 22, 137, 109, 240, 38, 45, 214, 199, 223, 29, 214, 138, 241, 41, 151, 45, 6, 64, 121, 233, 43, 93, 156, 243, 159, 168, 204, 210, 88, 225, 213, 150, 225, 39, 239, 217, 134, 202, 8, 206, 89, 250, 201, 207, 4, 81, 120, 58, 101, 131, 179, 155, 102, 141, 145, 108, 218, 114, 12, 157, 164, 141, 128, 128, 235, 244, 44, 115, 142, 79, 134, 12, 234, 209, 244, 152, 40, 156, 141, 17, 57, 222, 172, 9, 53, 189, 75, 37, 145, 88, 62, 33, 20, 152, 20, 189, 1, 28, 26, 43, 131, 24, 212, 29, 87, 118, 238, 71, 38, 129, 26, 187, 125, 208, 70, 119, 101, 61, 109, 227, 145, 11, 184, 65, 63, 17, 50, 73, 19, 237, 195, 181, 213, 204, 62, 30, 200, 234, 128, 14, 252, 159, 183, 37, 212, 57, 161, 29, 242, 16, 213, 83, 63, 30, 117, 114, 199, 63, 69, 46, 201, 190, 246, 165, 96, 234, 114, 123, 52, 245, 199, 78, 231, 15, 91, 133, 64, 226, 131, 37, 2, 68, 129, 72, 131, 50, 247, 170, 20, 73, 38, 53, 148, 212, 82, 127, 127, 124, 152, 104, 238, 9, 185, 145, 119, 227, 173, 129, 0, 95, 143, 116, 210, 91, 77, 231, 229, 33, 34, 229, 97, 103, 131, 174, 78, 42, 173, 98, 54, 144, 6, 23, 228, 70, 99, 72, 111, 147, 8, 206, 37, 100, 247, 205, 199, 76, 224, 75, 248, 96, 69, 244, 67, 180, 208, 21, 139, 45, 161, 124, 106, 109, 112, 221, 242, 236, 221, 69, 208, 76, 38, 88, 34, 240, 128, 27, 134, 171, 201, 105, 150, 66, 4, 228, 180, 186, 18, 227, 43, 125, 223, 152, 76, 46, 116, 88, 94, 56, 156, 73, 131, 54, 178, 125, 181, 13, 34, 166, 236, 170, 75, 156, 208, 12, 100, 189, 183, 241, 24, 109, 13, 133, 51, 123, 92, 101, 63, 163, 242, 35, 228, 117, 145, 62, 37, 251, 9, 66, 48, 113, 53, 205, 225, 60, 205, 108, 87, 73, 11, 147, 207, 181, 179, 151, 112, 229, 163, 36, 235, 80, 13, 139, 166, 148, 1, 102, 11, 6, 241, 136, 72, 199, 91, 231, 23, 150, 110, 36, 214, 189, 121, 28, 233, 232, 166, 61, 97, 135, 35, 86, 131, 62, 52, 10, 56, 174, 254, 59, 223, 225, 236, 190, 165, 116, 125, 36, 13, 31, 154, 121, 26, 233, 27, 252, 231, 106, 235, 119, 153, 48, 111, 53, 60, 176, 101, 49, 219, 70, 204, 99, 201, 16, 5, 43, 23, 124, 239, 27, 46, 105, 191, 173, 67, 22, 25, 228, 105, 145, 13, 27, 143, 157, 45, 121, 83, 251, 1, 214, 130, 27, 141, 9, 79, 126, 194, 220, 188, 13, 150, 114, 166, 89, 242, 184, 167, 206, 233, 18, 139, 68, 140, 198, 125, 243, 42, 18, 66, 167, 211, 202, 204, 150, 225, 140, 38, 61, 235, 68, 106, 201, 225, 109, 176, 15, 174, 74, 243, 24, 150, 109, 133, 132, 94, 198, 215, 123, 179, 153, 94, 245, 90, 37, 42, 137, 243, 204, 105, 203, 87, 211, 74, 21, 3, 187, 207, 112, 169, 89, 88, 116, 79, 209, 198, 80, 140, 72, 75, 121, 125, 236]
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