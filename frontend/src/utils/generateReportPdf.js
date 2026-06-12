import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/** Generate DriveX analytics PDF report */
export async function generateReportPdf(reportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date().toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' });

  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('DriveX — Reports & Analytics', 14, 18);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${now}  |  Period: ${reportData.periodLabel}`, 14, 24);

  doc.setTextColor(30, 30, 30);
  let y = 38;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary Overview', 14, y);
  y += 8;

  const fmt = (v) => (v !== undefined && v !== null ? String(v) : '0');

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total Bookings', fmt(reportData.total)],
      ['Completed', fmt(reportData.completed)],
      ['Pending', fmt(reportData.pending)],
      ['Approved', fmt(reportData.approved)],
      ['Rejected', fmt(reportData.rejected)],
      ['Est. Revenue (LKR)', fmt(reportData.estimatedRevenue?.toLocaleString?.() ?? reportData.estimatedRevenue)],
      ['Satisfaction', `${fmt(reportData.satisfaction)}%`],
      ['Avg Rating', fmt(reportData.avgRating) || '—'],
      ['Reviews Count', fmt(reportData.ratedCount)],
      ['Completed Today', fmt(reportData.completedToday)]
    ],
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Booking Status Breakdown', 14, y);
  y += 6;

  const total = reportData.total || 1;
  autoTable(doc, {
    startY: y,
    head: [['Status', 'Count', 'Percentage']],
    body: [
      ['Completed', fmt(reportData.completed), `${Math.round((reportData.completed / total) * 100)}%`],
      ['Approved', fmt(reportData.approved), `${Math.round((reportData.approved / total) * 100)}%`],
      ['Pending', fmt(reportData.pending), `${Math.round((reportData.pending / total) * 100)}%`],
      ['Rejected', fmt(reportData.rejected), `${Math.round((reportData.rejected / total) * 100)}%`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [127, 13, 13] },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 12;

  if (reportData.topServices?.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Top Services', 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [['Rank', 'Service', 'Bookings', 'Price (LKR)']],
      body: reportData.topServices.map((s, i) => [
        i + 1,
        s.name || s._id || '—',
        fmt(s.count),
        s.price ? s.price.toLocaleString() : '—'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 }
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  if (reportData.monthlyStats?.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Monthly Summary', 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [['Month', 'Total Bookings', 'Completed', 'Trend']],
      body: reportData.monthlyStats.map((m) => [
        `${m.month} ${m.year}`,
        fmt(m.total),
        fmt(m.completed),
        m.trend !== undefined ? `${m.trend >= 0 ? '+' : ''}${m.trend}%` : '—'
      ]),
      theme: 'striped',
      headStyles: { fillColor: [127, 13, 13] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 }
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  if (reportData.dailyStats?.length > 0) {
    if (y > 200) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Daily Bookings — ${reportData.periodLabel}`, 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [['Date', 'Bookings']],
      body: reportData.dailyStats.map((d) => [d._id, fmt(d.count)]),
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 }
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`DriveX Vehicle Services — Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  const filename = `drivex-report-${reportData.period}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
