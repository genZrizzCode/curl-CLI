# curl-ascii

A CLI to generate a 'curlable' ASCII animation Go project, perfect for fun terminal demos or web-based terminal art!

## Features
- Generate a Go project that prints animated ASCII art in the terminal
- Easily customize the number of frames and animation speed
- Make your animation accessible via `curl` from anywhere

---

## Installation

Install globally using npm:

```sh
npm install -g curl-ascii
```

This will provide the `curlme` command.

---

## Usage

### 1. Generate a Go ASCII Animation Project

Run the following command:

```sh
curlme now
```

You will be prompted for:
- **Go project name** (directory will be created)
- **Number of frames** (max 240)
- **Frames per second** (max 120)

Or, to use the default template (4 frames, 5 FPS):

```sh
curlme now --default

# Or

curlme now -d
```

This creates a folder with `go.mod` and `main.go` containing your animation.

---

### 2. Build the Go Project

Navigate into your new project folder:

```sh
cd <your-project-name>
```

Build the Go binary:

```sh
go build -o ascii-anim main.go
```

---

### 3. Make It Curlable

To make your animation accessible via `curl`, you need to serve the binary over HTTP. The easiest way is to use a simple HTTP server. For example, using Python:

```sh
python3 -m http.server 8080
```

Or with Go:

```sh
go install github.com/codeskyblue/gohttpserver@latest
# Then run:
gohttpserver -p 8080
```

Place your `ascii-anim` binary in the served directory.

**Tip:** You can also test your animation locally before serving by running:

```sh
go run main.go
```

and then, in another terminal, run:

```sh
curl localhost:8080
```

---

### 4. Host on a Public Site

- Deploy your binary and HTTP server to a VPS, cloud VM, or a service like Fly.io, Railway, or Render.
- Make sure the HTTP server is accessible from the public internet.

---

### 5. Curl Your Animation!

From anywhere, run:

```sh
curl <your-server-url>:8080/ascii-anim | bash
```

This downloads and runs your animation in the terminal!

---

## Example: Full Workflow

```sh
# 1. Generate project
curlme now --default
# 2. Build
cd <your-project-name>
go build -o ascii-anim main.go
# 3. Serve
python3 -m http.server 8080
# 4. On another machine/terminal:
curl http://<your-ip>:8080/ascii-anim | bash
```

---

## Extra: Ping Command

You can also use:

```sh
curlme ping [host]
```

To send a ping and get a pretty-printed response. (It defaults to [go.dev](https://go.dev) if no host is specified)

---

## License
\

MIT

---
