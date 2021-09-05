const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiUrl = `https://api.lyrics.ovh`

const getMoreSongs = async url => {
  const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
  const data = await response.json()

  insertSongsIntoPage(data)
}

const insertSongsIntoPage = (songInfo => {
  // map() cria um array, .join() junta tudo.
  songsContainer.innerHTML = songInfo.data.map(song => 
      `<li class="song">
        <span class="song-artist">
          <strong>${song.artist.name}</strong> - ${song.title}
        </span>
        <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">ver letra</button>
      </li>`
    ).join('')

    if (songInfo.prev || songInfo.next) {
      prevAndNextContainer.innerHTML = `
      ${songInfo.prev ? `<button class="btn" onClick="getMoreSongs('${songInfo.prev}')">anterior</button>`: ''}
      ${songInfo.next ? `<button class="btn" onClick="getMoreSongs('${songInfo.next}')">próximo</button>`: ''}
      `
      return
    }

    prevAndNextContainer.innerHTML = ''
})

const fetchSongs = async term => {
  const response = await fetch(`${apiUrl}/suggest/${term}`)
  const data = await response.json()
  
  insertSongsIntoPage(data)
}

form.addEventListener('submit', (event) => {
  event.preventDefault()

  // trim() remove white spaces before and after strings
  const searchTerm = searchInput.value.trim()

  if (!searchTerm) {
    songsContainer.innerHTML = `<li class="warning-message">Please type a song name...</li>`
    return
  }

  fetchSongs(searchTerm)
})

const fetchLyrics = async (artist, songTitle) => {
  const response = await fetch(`${apiUrl}/vi/${artist}/${songTitle}`)
  const data = await response.json()
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

  songsContainer.innerHTML = `
    <li class="lyrics-container">
      <h2><strong>${songTitle}</strong> - ${artist}</h2>
      <p class="lyrics">${lyrics}</p>
    </li>
  `
}

songsContainer.addEventListener('click', (event) => {
  const clickedElement = event.target

  if (clickedElement.tagName === 'BUTTON') {
    const artist = clickedElement.getAtribute('data.artist')
    const songTitle = clickedElement.getAtribute('data-song-title')

    prevAndNextContainer.innerHTML = ''

    fetchLyrics(artist, songTitle)
  }
})