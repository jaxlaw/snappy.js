(function() {

    var LITERAL = 0;
    var COPY_1_BYTE_OFFSET = 1;  // 3 bit length + 3 bits of offset in opcode
    var COPY_2_BYTE_OFFSET = 2;
    var COPY_4_BYTE_OFFSET = 3;
    var highBitMask = 0x80;

    var compress = function (arraybuffer, offset, length, outArrayBuffer, outOffet) {
    }

    var decompress = function (arraybuffer, offset, length, outArrayBuffer, outOffet) {
    }

    var decompress2 = function (arraybuffer, offset, length) {
    }

    var writeUncompressedLength = function (compressed, compressedOffset, uncompressedLength)
    {
        if (uncompressedLength < (1 << 7) && uncompressedLength >= 0) {
            compressed[compressedOffset++] = (uncompressedLength);
        }
        else if (uncompressedLength < (1 << 14) && uncompressedLength > 0) {
            compressed[compressedOffset++] = (uncompressedLength | highBitMask);
            compressed[compressedOffset++] = (uncompressedLength >>> 7);
        }
        else if (uncompressedLength < (1 << 21) && uncompressedLength > 0) {
            compressed[compressedOffset++] = (uncompressedLength | highBitMask);
            compressed[compressedOffset++] = ((uncompressedLength >>> 7) | highBitMask);
            compressed[compressedOffset++] = (uncompressedLength >>> 14);
        }
        else if (uncompressedLength < (1 << 28) && uncompressedLength > 0) {
            compressed[compressedOffset++] = (uncompressedLength | highBitMask);
            compressed[compressedOffset++] = ((uncompressedLength >>> 7) | highBitMask);
            compressed[compressedOffset++] = ((uncompressedLength >>> 14) | highBitMask);
            compressed[compressedOffset++] = (uncompressedLength >>> 21);
        }
        else {
            compressed[compressedOffset++] = (uncompressedLength | highBitMask);
            compressed[compressedOffset++] = ((uncompressedLength >>> 7) | highBitMask);
            compressed[compressedOffset++] = ((uncompressedLength >>> 14) | highBitMask);
            compressed[compressedOffset++] = ((uncompressedLength >>> 21) | highBitMask);
            compressed[compressedOffset++] = (uncompressedLength >>> 28);
        }
        return compressedOffset;
    }

    var readUncompressedLength = function(arrayBuffer, compressedOffset) {
        var compressed = new Uint8Array(arrayBuffer, compressedOffset, 5); // var int is at most 5 bytes
        var result = 0;
        var bytesRead = 0;
        for (var shift = 0; shift <= 28; shift += 7) {
            var b = compressed[compressedOffset + bytesRead++] & 0xFF;

            // add the lower 7 bits to the result
            result |= ((b & 0x7f) << shift);

            // if high bit is not set, this is the last byte in the number
            if ((b & 0x80) == 0) {
                return {len:result, bytesRead:bytesRead};
            }
        }
        throw "last byte of variable length int has high bit set";
    }

    var estimatedMaxCompressedLength = function(sourceLength) {
        return 32 + sourceLength + sourceLength / 6;
    }

    if (! window.Snappy) {
        Snappy = {};
    }
    Snappy.compress = compress;
    Snappy.decompress = decompress;
    Snappy.decompress2 = decompress2;
    Snappy.estimatedMaxCompressedLength = estimatedMaxCompressedLength ;
    Snappy.readUncompressedLength = readUncompressedLength;
    Snappy.writeUncompressedLength = writeUncompressedLength;
})();