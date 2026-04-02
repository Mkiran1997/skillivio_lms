function PaginationBar({ ...props }) {
    var page = props.page, total = props.total, totalPages = props.totalPages,
        setPage = props.setPage, perPage = props.perPage, color = props.color || "#2FBF71";
    if (totalPages <= 1) return null;
    var from = (page - 1) * perPage + 1, to = Math.min(page * perPage, total);
    var pages = [];
    for (var i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
        else if (pages[pages.length - 1] !== "...") pages.push("...");
    }
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>Showing {from}–{to} of {total}</span>
            <div style={{ display: "flex", gap: 6 }}>
                <button onClick={function () { setPage(page - 1); }} disabled={page === 1}
                    style={{
                        padding: "5px 12px", borderRadius: 6, border: "1px solid #e2e8f0", background: page === 1 ? "#f8fafc" : "#fff",
                        color: page === 1 ? "#cbd5e1" : "#475569", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: 12
                    }}>‹</button>
                {pages.map(function (p, i) {
                    return p === "..." ? <span key={"e" + i} style={{ padding: "5px 4px", color: "#94a3b8", fontSize: 12 }}>…</span>
                        : <button key={p} onClick={function () { setPage(p); }}
                            style={{
                                padding: "5px 10px", borderRadius: 6, border: "1px solid " + (p === page ? color : "#e2e8f0"),
                                background: p === page ? color : "#fff", color: p === page ? "#fff" : "#475569",
                                cursor: "pointer", fontWeight: p === page ? 700 : 400, fontSize: 12
                            }}>{p}</button>;
                })}
                <button onClick={function () { setPage(page + 1); }} disabled={page === totalPages}
                    style={{
                        padding: "5px 12px", borderRadius: 6, border: "1px solid #e2e8f0",
                        background: page === totalPages ? "#f8fafc" : "#fff", color: page === totalPages ? "#cbd5e1" : "#475569",
                        cursor: page === totalPages ? "not-allowed" : "pointer", fontSize: 12
                    }}>›</button>
            </div>
        </div>
    );
}

export default PaginationBar;