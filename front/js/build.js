function build(data) {
  var html = "";
  data.forEach((element, index) => {
    const { questiontypename } = element;
    html += "<div class='item'><div class='num'>" + (index + 1) + `.${questiontypename}</div>`;
    html += "<div class='question' style=''>" + unzip(element.subjecthtml_svg).replace(/\<(\/?)p/g, `\<$1div`) + "</div>";
    if (questiontypename.includes("选")) {
      html += "<div class='answer' style='display:flex;'>";
      element.options.forEach((item, index) => {
        html += `&nbsp;&#${65 + index};.&nbsp;`;
        if (item.istrue == "1") {
          html += unzip(item.questionoptionhtml_svg).replace("</p>", " ✅</p>");
        } else {
          html += unzip(item.questionoptionhtml_svg);
        }
      });
      html += "</div>";
    } else if (questiontypename.includes("填空") || questiontypename.includes("运行结果")) {
      html += "<div class='answer' style='display:flex;'>";
      element.options.forEach((item, index) => {
        html += `&nbsp;&nbsp;&nbsp;&nbsp;`;
        html += unzip(item.questionoptionhtml_svg);
      });
      html += "</div>";
    } else {
      html += "<div class='answer' style=''>" + unzip(element.answerhtml_svg) + "</div>";
    }
    html += "</div>";
  });
  return html;
}
function unzip(b64Data) {
  if (b64Data == "" || b64Data == null || b64Data.length == 1) {
    return b64Data;
  }
  var strData = atob(b64Data);
  var charData = strData.split("").map(function (x) {
    return x.charCodeAt(0);
  });
  var binData = new Uint8Array(charData);
  var data = pako.inflate(binData, {
    to: "string",
  });
  return data;
}
