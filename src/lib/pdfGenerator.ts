import { jsPDF } from 'jspdf';
import { Match, Tournament } from '../types/index.ts';

export function downloadFixturePDF(tournament: Tournament, matches: Match[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background Dark Navy header block
  doc.setFillColor(11, 20, 44);
  doc.rect(0, 0, 210, 40, 'F');

  // Title & Branding
  doc.setTextColor(0, 229, 153);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PSCMR COLLEGE OF ENGINEERING & TECHNOLOGY', 105, 14, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Department of Physical Education & Sports Arena', 105, 22, { align: 'center' });

  doc.setTextColor(200, 220, 240);
  doc.setFontSize(9);
  doc.text('Kothapeta, Vijayawada - 520001, Andhra Pradesh | Approved by AICTE, Affiliated to JNTUK', 105, 28, { align: 'center' });

  // Tournament Heading
  doc.setFillColor(240, 245, 250);
  doc.rect(14, 46, 182, 22, 'F');
  doc.setDrawColor(200, 215, 230);
  doc.rect(14, 46, 182, 22, 'S');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(tournament.title, 20, 54);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Sport: ${tournament.sport}  |  Format: ${tournament.format}  |  Category: ${tournament.genderCategory}  |  Venue: ${tournament.venue}`,
    20,
    62
  );

  // Fixtures Table Header
  let y = 78;
  doc.setFillColor(15, 30, 66);
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ROUND', 18, y + 5.5);
  doc.text('MATCH FIXTURE', 60, y + 5.5);
  doc.text('DATE & TIME', 135, y + 5.5);
  doc.text('STATUS', 175, y + 5.5);

  y += 8;

  matches.forEach((m, index) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(index % 2 === 0 ? 255 : 248, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 253);
    doc.rect(14, y, 182, 10, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + 10, 196, y + 10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(m.round || `Match ${index + 1}`, 18, y + 6.5);

    doc.setFont('helvetica', 'normal');
    const fixtureText = `${m.teamA.name} (${m.teamA.department})  vs  ${m.teamB.name} (${m.teamB.department})`;
    doc.text(fixtureText, 60, y + 6.5);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.text(`${m.scheduledDate} ${m.scheduledTime || ''}`, 135, y + 6.5);

    if (m.status === 'Completed') {
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text(`Won by ${m.winnerDepartment || 'Winner'}`, 175, y + 6.5);
    } else if (m.status === 'Live') {
      doc.setTextColor(239, 68, 68);
      doc.setFont('helvetica', 'bold');
      doc.text('LIVE NOW', 175, y + 6.5);
    } else {
      doc.setTextColor(100, 116, 139);
      doc.text('Scheduled', 175, y + 6.5);
    }

    y += 10;
  });

  // Footer notes & Official Signatures
  y = Math.max(y + 16, 250);
  if (y > 265) {
    doc.addPage();
    y = 240;
  }

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('* All teams must report 30 minutes before their scheduled slot with valid College ID cards.', 14, y);

  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.text('_____________________________', 30, y);
  doc.text('_____________________________', 145, y);

  y += 5;
  doc.text('Prof. Sports Coordinator', 35, y);
  doc.text('Dr. Principal / Director', 152, y);

  doc.save(`${tournament.title.replace(/\s+/g, '_')}_Fixtures.pdf`);
}

export function downloadCertificatePDF(data: {
  studentName: string;
  rollNo: string;
  department: string;
  tournamentTitle: string;
  sport: string;
  position: 'Winner' | 'Runner-Up' | 'Participation' | 'Player of the Tournament';
  issueDate?: string;
}) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Background Outer Dark Navy Border
  doc.setFillColor(7, 14, 32);
  doc.rect(0, 0, 297, 210, 'F');

  // Inner Certificate Parchment
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(10, 10, 277, 190, 4, 4, 'F');

  // Decorative Golden Border
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1.5);
  doc.rect(15, 15, 267, 180, 'S');
  doc.setLineWidth(0.5);
  doc.rect(17, 17, 263, 176, 'S');

  // College Header
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PSCMR COLLEGE OF ENGINEERING & TECHNOLOGY', 148.5, 36, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Affiliated to JNTUK, Kakinada | Approved by AICTE, New Delhi | Kothapeta, Vijayawada - 520001', 148.5, 43, {
    align: 'center',
  });

  doc.setTextColor(0, 150, 100);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DEPARTMENT OF PHYSICAL EDUCATION & SPORTS', 148.5, 51, { align: 'center' });

  // Certificate Type
  doc.setTextColor(180, 130, 20);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 68, { align: 'center' });

  // Body Text
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('This is to certify that Mr. / Ms.', 148.5, 82, { align: 'center' });

  // Student Name
  doc.setTextColor(11, 20, 44);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(data.studentName.toUpperCase(), 148.5, 96, { align: 'center' });

  // Roll No & Department
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Bearing Roll No: ${data.rollNo} from Department of ${data.department}`,
    148.5,
    106,
    { align: 'center' }
  );

  // Tournament & Achievement
  doc.text('has successfully demonstrated sporting excellence and secured', 148.5, 116, { align: 'center' });

  doc.setTextColor(0, 150, 90);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.position.toUpperCase()} POSITION`, 148.5, 128, { align: 'center' });

  doc.setTextColor(51, 65, 85);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `in ${data.sport} during "${data.tournamentTitle}"`,
    148.5,
    139,
    { align: 'center' }
  );

  doc.text(
    `conducted by PSCMRCET Sports Arena, Vijayawada on ${data.issueDate || 'November 2026'}.`,
    148.5,
    147,
    { align: 'center' }
  );

  // Signatures
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);

  doc.text('_________________________', 50, 175, { align: 'center' });
  doc.text('Sri. K. Venkatesh', 50, 181, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Physical Director', 50, 186, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('_________________________', 148.5, 175, { align: 'center' });
  doc.text('Prof. Sports Convenor', 148.5, 181, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('PSCMRCET Arena', 148.5, 186, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('_________________________', 247, 175, { align: 'center' });
  doc.text('Dr. J. Lakshmi Narayana', 247, 181, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Principal, PSCMRCET', 247, 186, { align: 'center' });

  doc.save(`${data.studentName.replace(/\s+/g, '_')}_PSCMRCET_Certificate.pdf`);
}
