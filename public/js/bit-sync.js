/**
 * bit-sync.js
 *
 * For more information see the readme.
 *
 * Source is located at https://github.com/claytongulick/bit-sync
 *
 * Licensed under the MIT License
 *
 * Copyright Clayton C. Gulick
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var md5WASM;
if (typeof (window) == "undefined") {
    md5WASM = require("./md5-wasm/md5-wasm")
} else {
    md5WASM = window.md5WASM
}

var md5;
if (!md5) {
    var performance = Date;
}
var BSync = new function () {
    /******* Privates *********/
    var md5 = async function (data) {
        return await md5WASM(data)
            .then(hash => { return hash })
            .catch(err => console.log(err))
        //     // convert number to (unsigned) 32 bit hex, zero filled string
        //     function to_zerofilled_hex(n) {
        //         var t1 = (n >>> 0).toString(16)
        //         return "00000000".substr(0, 8 - t1.length) + t1
        //     }
        //
        //     // convert array of chars to array of bytes
        //     function chars_to_bytes(ac) {
        //         var retval = []
        //         for (var i = 0; i < ac.length; i++) {
        //             retval = retval.concat(str_to_bytes(ac[i]))
        //         }
        //         return retval
        //     }
        //
        //
        //     // convert a 64 bit unsigned number to array of bytes. Little endian
        //     function int64_to_bytes(num) {
        //         var retval = []
        //         for (var i = 0; i < 8; i++) {
        //             retval.push(num & 0xFF)
        //             num = num >>> 8
        //         }
        //         return retval
        //     }
        //
        //     //  32 bit left-rotation
        //     function rol(num, places) {
        //         return ((num << places) & 0xFFFFFFFF) | (num >>> (32 - places))
        //     }
        //
        //     // The 4 MD5 functions
        //     function fF(b, c, d) {
        //         return (b & c) | (~b & d)
        //     }
        //
        //     function fG(b, c, d) {
        //         return (d & b) | (~d & c)
        //     }
        //
        //     function fH(b, c, d) {
        //         return b ^ c ^ d
        //     }
        //
        //     function fI(b, c, d) {
        //         return c ^ (b | ~d)
        //     }
        //
        //     // pick 4 bytes at specified offset. Little-endian is assumed
        //     function bytes_to_int32(arr, off) {
        //         return (arr[off + 3] << 24) | (arr[off + 2] << 16) | (arr[off + 1] << 8) | (arr[off])
        //     }
        //
        //     /*
        //      Conver string to array of bytes in UTF-8 encoding
        //      See:
        //      http://www.dangrossman.info/2007/05/25/handling-utf-8-in-javascript-php-and-non-utf8-databases/
        //      http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
        //      How about a String.getBytes(<ENCODING>) for Javascript!? Isn't it time to add it?
        //      */
        //     function str_to_bytes(str) {
        //         var retval = [ ]
        //         for (var i = 0; i < str.length; i++)
        //             if (str.charCodeAt(i) <= 0x7F) {
        //                 retval.push(str.charCodeAt(i))
        //             } else {
        //                 var tmp = encodeURIComponent(str.charAt(i)).substr(1).split('%')
        //                 for (var j = 0; j < tmp.length; j++) {
        //                     retval.push(parseInt(tmp[j], 0x10))
        //                 }
        //             }
        //         return retval
        //     }
        //
        //
        //     // convert the 4 32-bit buffers to a 128 bit hex string. (Little-endian is assumed)
        //     function int128le_to_hex(a, b, c, d) {
        //         var ra = ""
        //         var t = 0
        //         var ta = 0
        //         for (var i = 3; i >= 0; i--) {
        //             ta = arguments[i]
        //             t = (ta & 0xFF)
        //             ta = ta >>> 8
        //             t = t << 8
        //             t = t | (ta & 0xFF)
        //             ta = ta >>> 8
        //             t = t << 8
        //             t = t | (ta & 0xFF)
        //             ta = ta >>> 8
        //             t = t << 8
        //             t = t | ta
        //             ra = ra + to_zerofilled_hex(t)
        //         }
        //         return ra
        //     }
        //
        //     // conversion from typed byte array to plain javascript array
        //     function typed_to_plain(tarr) {
        //         var retval = new Array(tarr.length)
        //         for (var i = 0; i < tarr.length; i++) {
        //             retval[i] = tarr[i]
        //         }
        //         return retval
        //     }
        //
        //     // check input data type and perform conversions if needed
        //     var databytes = null
        //     // String
        //     var type_mismatch = null
        //     if (typeof data == 'string') {
        //         // convert string to array bytes
        //         databytes = str_to_bytes(data)
        //     } else if (data.constructor == Array) {
        //         if (data.length === 0) {
        //             // if it's empty, just assume array of bytes
        //             databytes = data
        //         } else if (typeof data[0] == 'string') {
        //             databytes = chars_to_bytes(data)
        //         } else if (typeof data[0] == 'number') {
        //             databytes = data
        //         } else {
        //             type_mismatch = typeof data[0]
        //         }
        //     } else if (typeof ArrayBuffer != 'undefined') {
        //         if (data instanceof ArrayBuffer) {
        //             databytes = typed_to_plain(new Uint8Array(data))
        //         } else if ((data instanceof Uint8Array) || (data instanceof Int8Array)) {
        //             databytes = typed_to_plain(data)
        //         } else if ((data instanceof Uint32Array) || (data instanceof Int32Array) ||
        //             (data instanceof Uint16Array) || (data instanceof Int16Array) ||
        //             (data instanceof Float32Array) || (data instanceof Float64Array)
        //         ) {
        //             databytes = typed_to_plain(new Uint8Array(data.buffer))
        //         } else {
        //             type_mismatch = typeof data
        //         }
        //     } else {
        //         type_mismatch = typeof data
        //     }
        //
        //     if (type_mismatch) {
        //         alert('MD5 type mismatch, cannot process ' + type_mismatch)
        //     }
        //
        //     function _add(n1, n2) {
        //         return 0x0FFFFFFFF & (n1 + n2)
        //     }
        //
        //
        //     return do_digest(databytes)
        //
        //     function do_digest(databytes) {
        //
        //         // function update partial state for each run
        //         function updateRun(nf, sin32, dw32, b32) {
        //             var temp = d
        //             d = c
        //             c = b
        //             //b = b + rol(a + (nf + (sin32 + dw32)), b32)
        //             b = 0x0FFFFFFFF & (b +
        //                 rol(
        //                     0x0FFFFFFFF & (a +
        //                         (0x0FFFFFFFF & (nf + (0x0FFFFFFFF & (sin32 + dw32))))
        //                     ), b32
        //                 )
        //             )
        //             a = temp
        //         }
        //
        //         // save original length
        //         var org_len = databytes.length
        //
        //         // first append the "1" + 7x "0"
        //         databytes.push(0x80)
        //
        //         // determine required amount of padding
        //         var tail = databytes.length % 64
        //         // no room for msg length?
        //         if (tail > 56) {
        //             // pad to next 512 bit block
        //             for (var i = 0; i < (64 - tail); i++) {
        //                 databytes.push(0x0)
        //             }
        //             tail = databytes.length % 64
        //         }
        //         for (i = 0; i < (56 - tail); i++) {
        //             databytes.push(0x0)
        //         }
        //         // message length in bits mod 512 should now be 448
        //         // append 64 bit, little-endian original msg length (in *bits*!)
        //         databytes = databytes.concat(int64_to_bytes(org_len * 8))
        //
        //         // initialize 4x32 bit state
        //         var h0 = 0x67452301
        //         var h1 = 0xEFCDAB89
        //         var h2 = 0x98BADCFE
        //         var h3 = 0x10325476
        //
        //         // temp buffers
        //         var a = 0, b = 0, c = 0, d = 0
        //
        //         // Digest message
        //         for (i = 0; i < databytes.length / 64; i++) {
        //             // initialize run
        //             a = h0
        //             b = h1
        //             c = h2
        //             d = h3
        //
        //             var ptr = i * 64
        //
        //             // do 64 runs
        //             updateRun(fF(b, c, d), 0xd76aa478, bytes_to_int32(databytes, ptr), 7)
        //             updateRun(fF(b, c, d), 0xe8c7b756, bytes_to_int32(databytes, ptr + 4), 12)
        //             updateRun(fF(b, c, d), 0x242070db, bytes_to_int32(databytes, ptr + 8), 17)
        //             updateRun(fF(b, c, d), 0xc1bdceee, bytes_to_int32(databytes, ptr + 12), 22)
        //             updateRun(fF(b, c, d), 0xf57c0faf, bytes_to_int32(databytes, ptr + 16), 7)
        //             updateRun(fF(b, c, d), 0x4787c62a, bytes_to_int32(databytes, ptr + 20), 12)
        //             updateRun(fF(b, c, d), 0xa8304613, bytes_to_int32(databytes, ptr + 24), 17)
        //             updateRun(fF(b, c, d), 0xfd469501, bytes_to_int32(databytes, ptr + 28), 22)
        //             updateRun(fF(b, c, d), 0x698098d8, bytes_to_int32(databytes, ptr + 32), 7)
        //             updateRun(fF(b, c, d), 0x8b44f7af, bytes_to_int32(databytes, ptr + 36), 12)
        //             updateRun(fF(b, c, d), 0xffff5bb1, bytes_to_int32(databytes, ptr + 40), 17)
        //             updateRun(fF(b, c, d), 0x895cd7be, bytes_to_int32(databytes, ptr + 44), 22)
        //             updateRun(fF(b, c, d), 0x6b901122, bytes_to_int32(databytes, ptr + 48), 7)
        //             updateRun(fF(b, c, d), 0xfd987193, bytes_to_int32(databytes, ptr + 52), 12)
        //             updateRun(fF(b, c, d), 0xa679438e, bytes_to_int32(databytes, ptr + 56), 17)
        //             updateRun(fF(b, c, d), 0x49b40821, bytes_to_int32(databytes, ptr + 60), 22)
        //             updateRun(fG(b, c, d), 0xf61e2562, bytes_to_int32(databytes, ptr + 4), 5)
        //             updateRun(fG(b, c, d), 0xc040b340, bytes_to_int32(databytes, ptr + 24), 9)
        //             updateRun(fG(b, c, d), 0x265e5a51, bytes_to_int32(databytes, ptr + 44), 14)
        //             updateRun(fG(b, c, d), 0xe9b6c7aa, bytes_to_int32(databytes, ptr), 20)
        //             updateRun(fG(b, c, d), 0xd62f105d, bytes_to_int32(databytes, ptr + 20), 5)
        //             updateRun(fG(b, c, d), 0x2441453, bytes_to_int32(databytes, ptr + 40), 9)
        //             updateRun(fG(b, c, d), 0xd8a1e681, bytes_to_int32(databytes, ptr + 60), 14)
        //             updateRun(fG(b, c, d), 0xe7d3fbc8, bytes_to_int32(databytes, ptr + 16), 20)
        //             updateRun(fG(b, c, d), 0x21e1cde6, bytes_to_int32(databytes, ptr + 36), 5)
        //             updateRun(fG(b, c, d), 0xc33707d6, bytes_to_int32(databytes, ptr + 56), 9)
        //             updateRun(fG(b, c, d), 0xf4d50d87, bytes_to_int32(databytes, ptr + 12), 14)
        //             updateRun(fG(b, c, d), 0x455a14ed, bytes_to_int32(databytes, ptr + 32), 20)
        //             updateRun(fG(b, c, d), 0xa9e3e905, bytes_to_int32(databytes, ptr + 52), 5)
        //             updateRun(fG(b, c, d), 0xfcefa3f8, bytes_to_int32(databytes, ptr + 8), 9)
        //             updateRun(fG(b, c, d), 0x676f02d9, bytes_to_int32(databytes, ptr + 28), 14)
        //             updateRun(fG(b, c, d), 0x8d2a4c8a, bytes_to_int32(databytes, ptr + 48), 20)
        //             updateRun(fH(b, c, d), 0xfffa3942, bytes_to_int32(databytes, ptr + 20), 4)
        //             updateRun(fH(b, c, d), 0x8771f681, bytes_to_int32(databytes, ptr + 32), 11)
        //             updateRun(fH(b, c, d), 0x6d9d6122, bytes_to_int32(databytes, ptr + 44), 16)
        //             updateRun(fH(b, c, d), 0xfde5380c, bytes_to_int32(databytes, ptr + 56), 23)
        //             updateRun(fH(b, c, d), 0xa4beea44, bytes_to_int32(databytes, ptr + 4), 4)
        //             updateRun(fH(b, c, d), 0x4bdecfa9, bytes_to_int32(databytes, ptr + 16), 11)
        //             updateRun(fH(b, c, d), 0xf6bb4b60, bytes_to_int32(databytes, ptr + 28), 16)
        //             updateRun(fH(b, c, d), 0xbebfbc70, bytes_to_int32(databytes, ptr + 40), 23)
        //             updateRun(fH(b, c, d), 0x289b7ec6, bytes_to_int32(databytes, ptr + 52), 4)
        //             updateRun(fH(b, c, d), 0xeaa127fa, bytes_to_int32(databytes, ptr), 11)
        //             updateRun(fH(b, c, d), 0xd4ef3085, bytes_to_int32(databytes, ptr + 12), 16)
        //             updateRun(fH(b, c, d), 0x4881d05, bytes_to_int32(databytes, ptr + 24), 23)
        //             updateRun(fH(b, c, d), 0xd9d4d039, bytes_to_int32(databytes, ptr + 36), 4)
        //             updateRun(fH(b, c, d), 0xe6db99e5, bytes_to_int32(databytes, ptr + 48), 11)
        //             updateRun(fH(b, c, d), 0x1fa27cf8, bytes_to_int32(databytes, ptr + 60), 16)
        //             updateRun(fH(b, c, d), 0xc4ac5665, bytes_to_int32(databytes, ptr + 8), 23)
        //             updateRun(fI(b, c, d), 0xf4292244, bytes_to_int32(databytes, ptr), 6)
        //             updateRun(fI(b, c, d), 0x432aff97, bytes_to_int32(databytes, ptr + 28), 10)
        //             updateRun(fI(b, c, d), 0xab9423a7, bytes_to_int32(databytes, ptr + 56), 15)
        //             updateRun(fI(b, c, d), 0xfc93a039, bytes_to_int32(databytes, ptr + 20), 21)
        //             updateRun(fI(b, c, d), 0xffeff47d, bytes_to_int32(databytes, ptr + 40), 15)
        //             updateRun(fI(b, c, d), 0x85845dd1, bytes_to_int32(databytes, ptr + 4), 21)
        //             updateRun(fI(b, c, d), 0x6fa87e4f, bytes_to_int32(databytes, ptr + 32), 6)
        //             updateRun(fI(b, c, d), 0xfe2ce6e0, bytes_to_int32(databytes, ptr + 60), 10)
        //             updateRun(fI(b, c, d), 0xa3014314, bytes_to_int32(databytes, ptr + 24), 15)
        //             updateRun(fI(b, c, d), 0x4e0811a1, bytes_to_int32(databytes, ptr + 52), 21)
        //             updateRun(fI(b, c, d), 0xf7537e82, bytes_to_int32(databytes, ptr + 16), 6)
        //             updateRun(fI(b, c, d), 0xbd3af235, bytes_to_int32(databytes, ptr + 44), 10)
        //             updateRun(fI(b, c, d), 0x2ad7d2bb, bytes_to_int32(databytes, ptr + 8), 15)
        //             updateRun(fI(b, c, d), 0xeb86d391, bytes_to_int32(databytes, ptr + 36), 21)
        //
        //             // update buffers
        //             h0 = _add(h0, a)
        //             h1 = _add(h1, b)
        //             h2 = _add(h2, c)
        //             h3 = _add(h3, d)
        //         }
        //         // Done! Convert buffers to 128 bit (LE)
        //         //return int128le_to_hex(h3, h2, h1, h0).toUpperCase()
        //         return [h0,h1,h2,h3];
        // }
    }
    /* ---- end md5 section ---- */

    /**
     * Create a fast 16 bit hash of a 32bit number. Just using a simple mod 2^16 for this for now.
     * TODO: Evaluate the distribution of adler32 to see if simple modulus is appropriate as a hashing function, or wheter 2^16 should be replaced with a prime
     */
    function hash16(i) {
        var p = 1867;
        return ((i >> 16) & 0xffff ^ ((i & 0xffff) * p)) & 0xffff;
    }

    /**
     * Create a 32 bit checksum for the block, based on the adler-32 checksum, with M as 2^16
     * Used to feed the rollingChecksum function, so returns the broken out pieces that are required for fast calc (since there's no reason to do pointless
     * bit manipulation, we just cache the parts, like {a: ..., b: ..., checksum: ... }.
     *
     * Offset is the start, and end is the last byte for the block to be calculated. end - offset should equal the blockSize - 1
     *
     * Data should be a Uint8Array
     *
     * TODO: according to wikipedia, the zlib compression library has a much more efficient implementation of adler. To speed this up, it might be worth investigating whether that can be used here.
     */
    function adler32_1(offset, end, data) {
        var i = 0;
        var a = 0;
        var b = 0;

        //adjust the end to make sure we don't exceed the extents of the data.
        if (end >= data.length)
            end = data.length - 1;

        for (i = offset; i <= end; i++) {
            a += data[i];
            b += a;
        }

        a %= 65536; //65536 = 2^16, used for M in the tridgell equation
        b %= 65536;

        return { a: a, b: b, checksum: ((b << 16) | a) >>> 0 };

    }
    var MOD_ADLER = 65521;
    function adler32(offset, end, data) {

        var a = 1, b = 0;

        //adjust the end to make sure we don't exceed the extents of the data.
        if (end >= data.length)
            end = data.length - 1;

        for (i = offset; i <= end; i++) {
            a += data[i];
            b += a;
            a %= MOD_ADLER;
            b %= MOD_ADLER;
        }

        return { a: a & 0xffffffff, b: b & 0xffffffff, checksum: ((b << 16) | a) & 0xffffffff };

    }
    /**
     * Performs a very fast rolling checksum for incremental searching using Tridgell's modification of adler-32 for rolling checksum
     * Returns an object suitable for use in additional calls to rollingChecksum, same as the adler32 function. This needs to be called with an offset of at least 1!
     * It is the responsibility of the called to make sure we don't exceed the bounds of the data, i.e. end MUST be less than data.length
     */
    function rollingChecksum1(adlerInfo, offset, end, data) {
        var temp = data[offset - 1]; //this is the first byte used in the previous iteration
        var a = (adlerInfo.a - temp + data[end]) % 65536;
        var b = (adlerInfo.b - ((end - offset + 1) * temp) + a) % 65536;
        return { a: a, b: b, checksum: (b << 16) | a };
    }

    function rollingChecksum(adlerInfo, offset, end, data) {
        var temp = data[offset - 1]; //this is the first byte used in the previous iteration
        var a = ((adlerInfo.a - temp + data[end]) % MOD_ADLER + MOD_ADLER) % MOD_ADLER;
        var b = ((adlerInfo.b - ((end - offset + 1) * temp) + a - 1) % MOD_ADLER + MOD_ADLER) % MOD_ADLER;
        return { a: a & 0xffffffff, b: b & 0xffffffff, checksum: ((b << 16) | a) & 0xffffffff };
    }

    /**
     * This is a function born of annoyance. You can't create a Uint32Array at a non 4 byte boundary. So this is necessary to read
     * a 32bit int from an arbitrary location. Lame.
     *
     * BTW: This assumes everything to be little endian.
     */
    function readInt32(uint8View, offset) {
        return (uint8View[offset] | uint8View[++offset] << 8 | uint8View[++offset] << 16 | uint8View[++offset] << 24) >>> 0;
    }

    /**
     * Create a document that contains all of the checksum information for each block in the destination data. Everything is little endian
     * Document structure:
     * First 4 bytes = block size
     * Next 4 bytes = number of blocks
     * Repeat for number of blocks:
     *   4 bytes, adler32 checksum
     *   16 bytes, md5 checksum
     *
     */
    async function createChecksumDocument(blockSize, data) {
        var startTime = performance.now();
        var numBlocks = Math.ceil(data.byteLength / blockSize);
        var i = 0;
        var docLength = (numBlocks * //the number of blocks times
            (4 +       //the 4 bytes for the adler32 plus
                16) +     //the 16 bytes for the md5
            4 +         //plus 4 bytes for block size
            4);         //plus 4 bytes for the number of blocks

        var doc = new ArrayBuffer(docLength);
        var dataView = new Uint8Array(data);
        var bufferView = new Uint32Array(doc);
        var offset = 2;
        var chunkSize = 5; //each chunk is 4 bytes for adler32 and 16 bytes for md5. for Uint32Array view, this is 20 bytes, or 5 4-byte uints

        bufferView[0] = blockSize;
        bufferView[1] = numBlocks;

        //spin through the data and create checksums for each block
        for (i = 0; i < numBlocks; i++) {
            var start = i * blockSize;
            var end = (i * blockSize) + blockSize;

            //calculate the adler32 checksum
            bufferView[offset] = adler32(start, end - 1, dataView).checksum;
            offset++;

            //calculate the full md5 checksum
            var chunkLength = blockSize;
            if ((start + blockSize) > data.byteLength)
                chunkLength = data.byteLength - start;

            md5sum = await md5(dataView.slice(start, start + chunkLength));
            for (var j = 0; j < 4; j++) bufferView[offset++] = md5sum[j];

        }
        var test1 = performance.now();
        console.log("checksum time: " + (test1 - startTime));
        return doc;

    }

    /**
     * Parse the checksum document into a hash table
     *
     * The hash table will have 2^16 entries. Each entry will point to an array that has the following strucutre:
     * [
     *  [ [blockIndex, adler32sum, md5sum],[blockIndex, adler32sum, md5sum],... ]
     *  [ [blockIndex, adler32sum, md5sum],[blockIndex, adler32sum, md5sum],... ]
     *  ...
     * ]
     */
    function parseChecksumDocument(checksumDocument) {
        var ret = [];
        var i = 0;
        var view = new Uint32Array(checksumDocument);
        var blockIndex = 1; //blockIndex is 1 based, not zero based
        var numBlocks = view[1];
        var row;
        var hash;

        //each chunk in the document is 20 bytes long. 32 bit view indexes 4 bytes, so increment by 5.
        for (i = 2; i <= view.length - 5; i += 5) {
            checksumInfo = [
                blockIndex, //the index of the block
                view[i], //the adler32sum
                [view[i + 1], view[i + 2], view[i + 3], view[i + 4]] //the md5sum
            ];
            hash = hash16(checksumInfo[1]);
            if (!ret[hash]) ret[hash] = [];
            ret[hash].push(checksumInfo);
            blockIndex++;
        }

        if (numBlocks != (blockIndex - 1)) {
            throw "Error parsing checksum document. Document states the number of blocks is: " + numBlocks + " however, " + blockIndex - 1 + " blocks were discovered";
        }
        return ret;

    }


    /**
     * Create a patch document that contains all the information needed to bring the destination data into synchronization with the source data.
     *
     * The patch document looks like this: (little Endian)
     * 4 bytes - blockSize
     * 4 bytes - number of patches
     * 4 bytes - number of matched blocks
     * For each matched block:
     *   4 bytes - the index of the matched block
     * For each patch:
     *   4 bytes - last matching block index. NOTE: This is 1 based index! Zero indicates beginning of file, NOT the first block
     *   4 bytes - patch size
     *   n bytes - new data
     */
    async function createPatchDocument(checksumDocument, data) {
        var content_traffic = 0;
        function appendBuffer(buffer1, buffer2) {
            var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
            tmp.set(new Uint8Array(buffer1), 0);
            tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
            return tmp.buffer;
        }

        /**
         * First, check to see if there's a match on the 16 bit hash
         * Then, look through all the entries in the hashtable row for an adler 32 match.
         * Finally, do a strong md5 comparison
         */
        async function checkMatch(adlerInfo, hashTable, block) {
            // var hash = hash16(adlerInfo.checksum);
            // if (!(hashTable[hash])) return false;
            var row = hashTable[hash];
            var i = 0;
            var matchedIndex = 0;

            for (i = 0; i < row.length; i++) {
                //compare adler32sum
                if ((row[i][1] & 0xffffffff) != adlerInfo.checksum) continue;
                //do strong comparison
                md5sum1 = await md5(block);
                // console.log('create patch md5: ', md5sum1)
                md5sum1 = new Uint32Array([md5sum1[0], md5sum1[1], md5sum1[2], md5sum1[3]]); //convert to unsigned 32
                md5sum2 = row[i][2];
                // md5sum2 = new Uint32Array([md5sum2[0], md5sum2[1], md5sum2[2], md5sum2[3]])
                // console.log('md5sum1: ', md5sum1)
                // console.log('md5sum2: ', md5sum2)

                if (
                    md5sum1[0] === md5sum2[0] &&
                    md5sum1[1] === md5sum2[1] &&
                    md5sum1[2] === md5sum2[2] &&
                    md5sum1[3] === md5sum2[3]
                )
                    return row[i][0]; //match found, return the matched block index

            }

            return false;

        }

        var checksumDocumentView = new Uint32Array(checksumDocument);
        var blockSize = checksumDocumentView[0];
        var numBlocks = checksumDocumentView[1];
        var numPatches = 0;

        var patchDocument = new ArrayBuffer(12);
        var patch;
        var patches = new ArrayBuffer(0);
        var i = 0;
        // console.log(checksumDocument)
        var hashTable = parseChecksumDocument(checksumDocument);
        // console.log('client parse checksum doc hash table: ', hashTable)
        var endOffset = data.byteLength - blockSize;
        var adlerInfo = null;
        var lastMatchIndex = 0;
        var currentPatch = new ArrayBuffer(1000);
        var currentPatchUint8 = new Uint8Array(currentPatch);
        var currentPatchSize = 0;
        var dataUint8 = new Uint8Array(data);
        var matchedBlocks = new ArrayBuffer(1000);
        var matchedBlocksUint32 = new Uint32Array(matchedBlocks);
        var matchCount = 0;


        let cnt1 = 0, cnt2 = 0
        let s, e, total = 0
        for (; ;) {
            var chunkSize = 0;
            //determine the size of the next data chuck to evaluate. Default to blockSize, but clamp to end of data
            if ((i + blockSize) > data.byteLength) {
                // chunkSize = data.byteLength - i;
                // adlerInfo = null; //need to reset this because the rolling checksum doesn't work correctly on a final non-aligned block
                for (; i < data.byteLength; i++) {
                    currentPatchUint8[currentPatchSize] = dataUint8[i];
                    currentPatchSize++;
                    content_traffic++;
                    if (currentPatchSize >= currentPatch.byteLength) {
                        //allocate another 1000 bytes
                        currentPatch = appendBuffer(currentPatch, new ArrayBuffer(1000));
                        currentPatchUint8 = new Uint8Array(currentPatch);
                    }
                }
                break;
            }
            else
                chunkSize = blockSize;

            s = performance.now()
            if (adlerInfo) {
                cnt1++
                adlerInfo = rollingChecksum(adlerInfo, i, i + chunkSize - 1, dataUint8);
            } else {
                cnt2++
                adlerInfo = adler32(i, i + chunkSize - 1, dataUint8);
            }

            var hash = hash16(adlerInfo.checksum);
            var matchedBlock = false
            if (!(hashTable[hash])) {
                matchedBlock = false
            } else {
                matchedBlock = await checkMatch(adlerInfo, hashTable, dataUint8.slice(i, i + chunkSize));
            }
            if (matchedBlock) {
                //if we have a match, do the following:
                //1) add the matched block index to our tracking buffer
                //2) check to see if there's a current patch. If so, add it to the patch document.
                //3) jump forward blockSize bytes and continue
                matchedBlocksUint32[matchCount] = matchedBlock;
                matchCount++;
                //check to see if we need more memory for the matched blocks
                if (matchCount >= matchedBlocksUint32.length) {
                    matchedBlocks = appendBuffer(matchedBlocks, new ArrayBuffer(1000));
                    matchedBlocksUint32 = new Uint32Array(matchedBlocks);
                }
                if (currentPatchSize > 0) {
                    //create the patch and append it to the patches buffer
                    patch = new ArrayBuffer(4 + 4); //4 for last match index, 4 for patch size
                    var patchUint32 = new Uint32Array(patch, 0, 2);
                    patchUint32[0] = lastMatchIndex;
                    patchUint32[1] = currentPatchSize;
                    patch = appendBuffer(patch, currentPatch.slice(0, currentPatchSize));
                    patches = appendBuffer(patches, patch);
                    currentPatch = new ArrayBuffer(1000);
                    currentPatchUint8 = new Uint8Array(currentPatch);
                    currentPatchSize = 0;
                    numPatches++;
                }
                lastMatchIndex = matchedBlock;
                i += blockSize
                if (i >= dataUint8.length - 1) break;
                adlerInfo = null;
                continue;
            }
            else {
                //while we don't have a block match, append bytes to the current patch
                currentPatchUint8[currentPatchSize] = dataUint8[i];
                currentPatchSize++;
                content_traffic++;
                if (currentPatchSize >= currentPatch.byteLength) {
                    //allocate another 1000 bytes
                    currentPatch = appendBuffer(currentPatch, new ArrayBuffer(1000));
                    currentPatchUint8 = new Uint8Array(currentPatch);
                }
            }
            if ((i) >= dataUint8.length - 1) break;
            i++;
            e = performance.now()
            total += e - s
        } //end for each byte in the data
        console.log("CNT1: ", cnt1)
        console.log("CNT2: ", cnt2)
        console.log('TOTOL: ', total)
        if (currentPatchSize > 0) {
            //create the patch and append it to the patches buffer
            patch = new ArrayBuffer(4 + 4); //4 for last match index, 4 for patch size
            var patchUint32 = new Uint32Array(patch, 0, 2);
            patchUint32[0] = lastMatchIndex;
            patchUint32[1] = currentPatchSize;
            patch = appendBuffer(patch, currentPatch.slice(0, currentPatchSize));
            patches = appendBuffer(patches, patch);
            numPatches++;
        }
        console.log('content traffic is', content_traffic);

        var patchDocumentView32 = new Uint32Array(patchDocument);
        patchDocumentView32[0] = blockSize;
        patchDocumentView32[1] = numPatches;
        patchDocumentView32[2] = matchCount;
        console.log('match count', matchCount);
        patchDocument = appendBuffer(patchDocument, matchedBlocks.slice(0, matchCount * 4));
        patchDocument = appendBuffer(patchDocument, patches);

        var patchDocumentView32 = new Uint32Array(patchDocument, 0, matchCount + 3);
        var patchDocumentView8 = new Uint8Array(patchDocument);

        return patchDocument;
    }

    /**
     * Apply the patch to the destination data, making it into a duplicate of the source data
     * Due to the inability to modify the size of ArrayBuffers once they have been allocated, this function
     * will return a new ArrayBuffer with the update file data. Note that this will consume a good bit of extra memory.
     */
    function applyPatch(patchDocument, data, new_length) {
        var ret = new Uint8Array(new_length)

        var patchDocumentView32 = new Uint32Array(patchDocument, 0, 3);
        var blockSize = patchDocumentView32[0];
        var patchCount = patchDocumentView32[1];
        var matchCount = patchDocumentView32[2];
        var matchedBlockView32 = new Uint32Array(patchDocument, 12, matchCount);
        var i = 0;
        var j = 0;

        //first, let's deal with the simple case where we fully match. This is just an optimization for the unchanged file case.
        //to determine this, the number of matches must exactly equal ceil of data / blockSize, and num patches must be zero
        //additionally, the matched block indexes must start with 1 and be in order. This is to deal with the extreme edge case of a block being relocated
        //on an exact block boundary
        if (patchCount == 0)
            if (Math.ceil(data.byteLength / blockSize) == matchCount)
                for (i = 1; i <= matchCount; i++)
                    if (matchedBlockView32[i - 1] != i) { break; }
        if ((i - 1) == matchCount) return data; //exact match

        //there was a modification. We need to construct the new document.
        //the way this works is as follows:
        //1) for each patch, get the last index of the matching block
        //2) loop through the matchedBlocks, appending blocks up to the index from step 1
        //3) append the patch at that point
        //4) after all patches have been applied, continue to loop through the matchedBlocks appending each one in order
        var offset = 12 + (matchCount * 4); //offset to the start of the patches
        var lastMatchingBlockIndex = 0;
        var patchSize = 0;
        var patchView8;
        var matchIndex = 0; //the index into the matching blocks array
        var blockIndex = 0; //the index of the block in the matching blocks array
        // var ret = new ArrayBuffer(0);
        var patchDocumentView8 = new Uint8Array(patchDocument);
        var chunkSize = 0;
        var dataView = new Uint8Array(data);
        var dataoffset = 0;
        for (i = 0; i < patchCount; i++) {
            lastMatchingBlockIndex = readInt32(patchDocumentView8, offset);
            patchSize = readInt32(patchDocumentView8, offset + 4);
            patchView8 = patchDocumentView8.slice(offset + 8, offset + 8 + patchSize)//new Uint8Array(patchDocument, offset + 8, patchSize);
            offset = offset + 8 + patchSize;

            for (; matchIndex < matchedBlockView32.length; matchIndex++) {
                blockIndex = matchedBlockView32[matchIndex];
                if (blockIndex > lastMatchingBlockIndex) break;
                if ((blockIndex * blockSize) > data.byteLength)
                    chunkSize = data.byteLength % blockSize;
                else chunkSize = blockSize;
                ret.set(dataView.slice((blockIndex - 1) * blockSize, (blockIndex - 1) * blockSize + chunkSize), dataoffset);
                dataoffset += chunkSize;
            }

            ret.set(patchView8, dataoffset);
            dataoffset += patchSize;
        }

        //we're done with all the patches, add the remaining blocks
        for (; matchIndex < matchedBlockView32.length; matchIndex++) {
            blockIndex = matchedBlockView32[matchIndex];
            if ((blockIndex * blockSize) > data.byteLength)
                chunkSize = data.byteLength % blockSize;
            else chunkSize = blockSize;
            ret.set(dataView.slice((blockIndex - 1) * blockSize, (blockIndex - 1) * blockSize + chunkSize), dataoffset);
            dataoffset += chunkSize;
        }

        return ret.buffer
    }

    /******** Public API ***********/
    this.createChecksumDocument = createChecksumDocument;
    this.createPatchDocument = createPatchDocument;
    this.applyPatch = applyPatch;
    this.util = { md5: md5, adler32: adler32, rollingChecksum: rollingChecksum, readInt32: readInt32 }; //mostly exposing these for the purposes of unit tests, but hey, if they are useful to someone, have at it!
};


if (((typeof require) != "undefined") &&
    ((typeof module) != "undefined") &&
    ((typeof module.exports) != "undefined"))
    module.exports = BSync;

