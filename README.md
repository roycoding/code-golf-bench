# Code Golf Benchmark Website

This repository contains the static GitHub Pages site for the Code Golf Benchmark.

The benchmark runner, task fixtures, raw model outputs, scoring traces, and private result data
are intentionally not included here. This repo is generated from the private benchmark
repository with:

```sh
uv run python -m benchmark.site_export --output ../codegolf-benchmark-site
```
