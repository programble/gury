# Gury

Upload anything to [imgur][imgur].

[imgur]: https://imgur.com

Gury uploads files in chunks encoded as PNGs to the anonymous public
image host [imgur][imgur].

## Install

```
npm install -g gury
```

## Usage

```
usage: gury [options] id | url | file...

options:
  -u, --upload                         Upload files
  -d, --download                       Download files
  -t, --list                           List contents of archive

  -c SPACE, --color-space SPACE        Set color space of PNGs

  -q, --quiet                          Suppress progress output
  --version                            Display version and exit
  -h, --help                           Display help and exit
```

### Upload

Gury can upload any number of files and directories as a single
"archive" of sorts. The information needed to retrieve the original
files (i.e. name, size, hash, imgur IDs) is stored in an index image.
The output of an upload command is the URL of this index image.

```
$ gury -u 04.\ Shop\ Vac.mp3
04. Shop Vac.mp3

https://i.imgur.com/tO5iaiD.png
```

If, for whatever reason, you wanted to chance the color space of the
encoded PNGs, you could use the `-c` option. The default is `rgb`, and
`rgba` is supported. This will result in PNGs with smaller dimensions.

To suppress output of filenames as they upload, use the `-q` option.

### List

Gury can list the contents of an archive by downloading and decoding the
context of the index image.

```
$ gury -t https://i.imgur.com/tO5iaiD.png
04. Shop Vac.mp3 4224247 95bc2064da397f6a22e191f152dbabeb9512beef fUawGvo ZFEYACS vqbp4gy y4kiFC1 0rgo8pn
```

For each file in the archive, a line is printed with the file name, size
in bytes, SHA1 hash of the contents, and the imgur IDs of each data
chunk.

### Download

Gury will download all files in the archive into the current directory,
creating directories as necessary. It accepts either an imgur URL or
simply the ID of the index image.

```
$ gury -d https://i.imgur.com/tO5iaiD.png
04. Shop Vac.mp3
```

## Technical

imgur supports lossless PNG uploads up to 1MB. Gury automatically splits
files into chunks that will fit into 1MB PNGs. All PNGs are square and
padded at the end with black pixels. Gury saves the number of data bytes
in the last chunk to know how large the original file was and when to
stop reading data.

The index image is a msgpack'd array of file metadata containing the
file name, last chunk size, SHA1 sum, and an arrary of imgur IDs of data
images. The index image is encoded and uploaded in the same way as the
data images.

## Warnings

Although files are uploaded in chunks encoded as PNGs, they are fare
from secure. If you are concerned about privacy, encrypt your files
before uploading them with Gury.

imgur does not retain images indefinitely, see
[their policy](http://help.imgur.com/hc/en-us/articles/201476457-How-long-do-you-keep-the-images-).
Your data may disappear.

## License

Copyright © 2015, Curtis McEnroe <curtis@cmcenroe.me>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
