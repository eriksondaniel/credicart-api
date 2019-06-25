const presets = [["@babel/env", {
    targets: { /* your targeted browser */ },
    useBuiltIns: "usage"  // <-----------------*** add this
}]];
module.exports = { presets };
