export default class ViewFooter {
  drawFooter() {
    const footer = document.createElement('footer');

    footer.innerHTML = `<div class='footer-wrapper'>
                                <a href='https://rs.school/'>
                                  <div class='RSSchool-icon'></div>
                                </a>
                                <div class='footer__creators-github'>
                                  <a class='footer__creators-item' href = 'https://github.com/ry-ksu'>
                                    <p>Ксения (ry-ksu)</p>
                                    <div class='footer__creators-gh'></div>
                                  </a>  
                                  <a class='footer__creators-item' href = 'https://github.com/chagins'>
                                    <p>Ярослав (chagins)</p>
                                    <div class='footer__creators-gh'></div>
                                  </a>  
                                  <a class='footer__creators-item' href = 'https://github.com/salladin95'>
                                    <p>Халид (salladin95)</p>
                                    <div class='footer__creators-gh'></div>
                                  </a>  
                                </div>
                                <h4>2022</h4>
                              </div>`;

    document.body.append(footer);
  }
}
