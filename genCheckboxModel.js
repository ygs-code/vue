var $$a = item.selected,
    $$el = $event.target,
    $$c = $$el.checked ? (true) : (false);
if (Array.isArray($$a)) {
    var $$v = "index",
        $$i = _i($$a, $$v);
    if ($$el.checked) {
        $$i < 0 && ($set(item, "selected", $$a.concat([$$v])))
    } else {
        $$i > -1 && ($set(item, "selected", $$a.slice(0, $$i).concat($$a.slice($$i + 1))))
    }
} else {
    $set(item, "selected", $$c)
}