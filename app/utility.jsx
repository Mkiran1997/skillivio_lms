import { useEffect, useState } from 'react';
import { USER_ACCOUNTS } from './mockData';
import * as xlsx from 'xlsx';

export function getUser(email  , pw  ) {
    return USER_ACCOUNTS.find(function (u) {
        return u.email.toLowerCase() === email.toLowerCase().trim() && u.password === pw;
    }) || null;
}

export function useTheme(tenant  ) {
    useEffect(function () {
        var r = document.documentElement;
        r.style.setProperty("--primary", tenant.primary);
        r.style.setProperty("--secondary", tenant.secondary);
        r.style.setProperty("--accent", tenant.accent);
    }, [tenant]);
}

export function usePagination(items  , perPage  ) {
    var safePerPage = perPage || 5;
    var [page, setPage] = useState(1);
    var total = items.length;
    var totalPages = Math.max(1, Math.ceil(total / safePerPage));
    var safePage = Math.min(page, totalPages);
    var slice = items.slice((safePage - 1) * safePerPage, safePage * safePerPage);
    return { page: safePage, setPage: setPage, total: total, totalPages: totalPages, slice: slice };
}

export function exportXLSX(filename  , rows  , sheetName  ) {

    var XLSX   = xlsx;
    if (!XLSX) { alert("SheetJS CDN required"); return; }
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = rows[0].map(function (_  , ci  ) { return { wch: Math.max.apply(null, rows.map(function (r  ) { return String(r[ci] || "").length; }).concat(14)) }; });
    XLSX.utils.book_append_sheet(wb, ws, sheetName || "Sheet1");
    XLSX.writeFile(wb, filename);
}
