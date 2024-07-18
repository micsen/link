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


const encLinks = {
  enc: {
    private: {
      salt: [226, 174, 184, 161, 122, 230, 12, 29, 100, 98, 148, 255, 157, 136, 169, 52],
      data: [178, 217, 105, 87, 217, 47, 167, 151, 253, 118, 182, 74, 6, 193, 210, 192, 203, 150, 220, 232, 46, 120, 130, 107, 229, 228, 26, 220, 106, 72, 93, 136, 152, 35, 222, 74, 167, 95, 15, 183, 168, 59, 78, 108, 74, 107, 202, 85, 36, 140, 137, 146, 40, 35, 191, 213, 189, 164, 169, 160, 71, 58, 16, 43, 145, 4, 201, 1, 229, 54, 232, 139, 55, 137, 213, 196, 172, 198, 89, 69, 95, 135, 124, 30, 31, 132, 79, 98, 147, 148, 203, 211, 107, 90, 106, 187, 163, 79, 72, 62, 250, 59, 60, 134, 54, 206, 37, 109, 242, 184, 87, 117, 238, 148, 179, 99, 49, 122, 246, 98, 232, 102, 39, 187, 255, 187, 18, 197, 22, 237, 166, 76, 233, 200, 65, 89, 95, 124, 173, 80, 167, 80, 48, 123, 7, 166, 189, 227, 182, 54, 29, 189, 227, 255, 253, 139, 138, 88, 127, 191, 1, 91, 138, 79, 160, 120, 139, 56, 244, 230, 116, 13, 127, 157, 148, 51, 152, 251, 147, 212, 111, 76, 217, 133, 178, 204, 6, 92, 74, 255, 44, 89, 252, 164, 101, 73, 73, 180, 15, 203, 1, 198, 218, 57, 107, 239, 156, 181, 216, 98, 48, 110, 140, 57, 97, 214, 250, 146, 20, 216, 188, 40, 4, 179, 137, 202, 75, 123, 137, 187, 84, 45, 24, 19, 73, 105, 136, 181, 151, 94, 193, 4, 243, 209, 109, 196, 230, 131, 141, 230, 89, 71, 128, 3, 26, 89, 80, 172, 25, 229, 205, 64, 202, 140, 72, 107, 221, 220, 67, 146, 213, 57, 194, 232, 14, 109, 67, 169, 56, 6, 124, 204, 133, 20, 168, 17, 208, 255, 238, 101, 147, 82, 35, 69, 111, 211, 104, 219, 35, 135, 116, 40, 183, 217, 38, 16, 147, 23, 53, 219, 181, 201, 153, 171, 96, 242, 19, 10, 214, 1, 102, 52, 4, 40, 104, 4, 244, 202, 7, 50, 3, 56, 47, 189, 106, 30, 91, 127, 217, 153, 180, 232, 59, 225, 61, 102, 4, 167, 13, 176, 151, 212, 225, 204, 38, 209, 71, 158, 170, 23, 29, 200, 32, 167, 25, 12, 195, 17, 194, 103, 87, 65, 106, 69, 223, 169, 174, 43, 234, 156, 241, 229, 115, 38, 1, 156, 157, 245, 68, 32, 241, 216, 111, 75, 66, 40, 170, 39, 185, 165, 149, 82, 31, 224, 137, 35, 141, 130, 11, 15, 98, 127, 40, 235, 224, 3, 195, 130, 5, 72, 39, 231, 93, 21, 48, 93, 54, 42, 157, 230, 173, 184, 11, 68, 96, 58, 130, 36, 84, 56, 189, 201, 113, 28, 5, 10, 231, 22, 85, 21, 174, 161, 139, 254, 41, 93, 205, 27, 128, 124, 64, 35, 133, 91, 76, 85, 109, 203, 206, 231, 145, 229, 30, 223, 139, 26, 166, 166, 221, 139, 206, 31, 214, 143, 224, 51, 155, 218, 253, 233, 243, 103, 120, 84, 116, 40, 161, 165, 126, 132, 78, 81, 47, 25, 117, 121, 186, 94, 253, 13, 62, 25, 26, 174, 135, 202, 25, 23, 23, 141, 13, 66, 217, 223, 204, 132, 211, 55, 162, 160, 228, 175, 55, 114, 15, 182, 37, 58, 150, 72, 19, 4, 161, 170, 23, 161, 248, 138, 130, 112, 170, 145, 38, 228, 201, 64, 138, 12, 143, 173, 30, 123, 255, 35, 131, 5, 39, 157, 160, 112, 214, 159, 220, 69, 84, 10, 211, 43, 65, 77, 21, 37, 210, 160, 234, 168, 28, 244, 116, 176, 249, 252, 22, 40, 152, 163, 101, 122, 96, 92, 43, 191, 167, 108, 188, 179, 115, 203, 94, 155, 48, 144, 169, 33, 3, 31, 137, 97, 249, 230, 60, 115, 165, 95, 16, 221, 222, 64, 223, 102, 66, 160, 243, 219, 43, 210, 173, 62, 123, 111, 78, 49, 14, 107, 202, 84, 12, 71, 226, 200, 44, 57, 239, 43, 17, 176, 134, 166, 75, 171, 174, 101, 97, 116, 35, 210, 122, 118, 103, 33, 85, 117, 37, 7, 197, 237, 84, 50, 44, 240, 93, 236, 41, 40, 127, 229, 135, 23, 120, 98, 90, 182, 2, 230, 101, 76, 220, 195, 46, 130, 123, 111, 77, 229, 233, 84, 190, 40, 48, 247, 130, 33, 186, 245, 68, 239, 19, 1, 73, 226, 156, 166, 143, 165, 100, 189, 137, 91, 65, 125, 79, 62, 51, 161, 111, 98, 151, 111, 153, 11, 86, 143, 63, 78, 173, 122, 100, 188, 193, 70, 126, 104]
    }
  }
}

function buildLinks(links) {
  links.forEach((link) => {
    console.log(link)
    document.getElementById('links').innerHTML += `
                <a class="link" href="${link.link}" target="_blank">
                    <i class="${link.icon}">&nbsp;</i>${link.text}
                </a>`
  })
}

window.onload = function () {
  let links
  // public links
  buildLinks[
    {
      "text": "Signal",
      "link": "https://signal.me/#eu/fTCjmo2joPFpyEVzENn9MK1kllOBWOaJOarM2Mjtj4_AF2--wDNGVKz81fzoNydu",
      "icon": "fa-brands fa-signal-messenger"
    }]
  try {
    // get query string
    var query = window.location.search.substring(1)
    console.log(query)
    // encrypt
    /*const clearText = JSON.stringify(links.private)
    encrypt(clearText, query, salt(), (ciphertext, salt) => {
        console.log(JSON.stringify(salt))
        const data = JSON.stringify(ciphertext);
        console.log(data)
    })*/

    //decrypt
    const key = query.split("=")[0]
    const enc = encLinks.enc[key]


    decrypt(enc.data, query, enc.salt, (plaintext) => {
      console.log(plaintext)

      links = JSON.parse(plaintext).links
      buildLinks(links)


    })
  } catch (error) {
  }


}
