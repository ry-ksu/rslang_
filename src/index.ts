import WordsApi from './services/wordsAPI';
import Loader from './services/loader';
import ViewTextBook from './components/textBook/view';

const wordsApi = new WordsApi({ LoaderService: Loader });

const main = document.createElement('main') as HTMLDivElement;
main.style.padding = '50px';
document.body.appendChild(main);

const wordID = '5e9f5ee35eb9e72bc21af4a0';

const vb = new ViewTextBook(main);
// vb.drawHeader();

wordsApi.getWords({ wordGroup: 0, wordPage: 0})
  .then((res) => {
    console.log(res);
    const pageNumber = 1;
    const maxPageNumber = 20;
    vb.draw({words: res, pageNumber, maxPageNumber})
  })
  .catch((err) => console.log(err));



// wordsApi
//   .getWord({ wordID })
//   .then((res) => {
//     console.log(res);
//     vb.drawCard({word: res});
//   })
//   .catch((err) => console.log(err));

console.log('VICTORY');
