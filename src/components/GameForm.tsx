import { useState, type FormEvent } from "react"
import { genres, genres_labels, type GameGenre, type TGameInput } from "../types"
import { api } from "../api"
import { useGamesStore } from "../store/useGamesStore"

const initialForm: TGameInput = {
    title: "",
    rating: 9,
    price: 0,
    genre: "rpg",
    platforms: ["PC"],
    releaseDate: new Date().toISOString().slice(0, 10),
}
export function GameForm() {
    const [form, setForm] = useState<TGameInput>(initialForm)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { getGames } = useGamesStore()
    const onChange = <K extends keyof TGameInput>(key: K, value: TGameInput[K]) => {
        setForm((j) => ({ ...j, [key]: value }))
    }

    const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            await api.createGame(form)
            getGames()
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCheckbox = (platform: string) => {
        const newPlatforms = form.platforms.includes(platform) ?
            form.platforms.filter(el => el !== platform)
            : [...form.platforms, platform]
            onChange('platforms', newPlatforms)
    }

    return (
        <form onSubmit={onSubmit} className="form">
            <h2>Добавить игру</h2>

            <label className="field">
                Название
                <input onChange={(e) => onChange("title", e.target.value)} type="text" name="title" value={form.title} required />
            </label>

            {/*  <label className="field">
                Описание
                <textarea rows={3} />
            </label>*/}

            <div className="row">
                <label className="field">
                    Жанр
                    <select name="genre" value={form.genre} onChange={(e) => onChange("genre", e.target.value as GameGenre)}>
                        {genres.map(q => (
                            <option value={q} key={q}>
                                {genres_labels[q]}
                            </option>
                        ))}

                    </select>
                </label>
                <label className="field">
                    Дата выхода
                    <input onChange={(e) => onChange("releaseDate", e.target.value)} name="releaseDate" value={form.releaseDate} type="date" required />
                </label>
            </div>

            <div className="row">
                <label className="field">
                    Рейтинг: {form.rating}
                    <input onChange={(e) => onChange("rating", Number(e.target.value))} type="range" name="rating"
                        value={form.rating} min={0} max={10} step={1} />
                </label>
                <label className="field">
                    Цена, €
                    <input onChange={(e) => onChange("price", Number(e.target.value))} name="price" max={100000}
                        value={form.price} type="number" min={0} step={0.01} />
                </label>
            </div>

            <fieldset>
                <legend>Платформы</legend>
                <label className="check">
                    <input checked={form.platforms.includes('PC')} name="PC" type="checkbox" onChange={() => handleCheckbox('PC')} />
                    ПК
                </label>

                <label className="check">
                    <input checked={form.platforms.includes('XBOX')} name="XBOX" type="checkbox" onChange={() => handleCheckbox('XBOX')}  />
                XBOX
                </label>

                <label className="check">
                    <input checked={form.platforms.includes('PS')} name="PS" type="checkbox" onChange={() => handleCheckbox('PS')}  />
                    PS
                </label>

            </fieldset>

            <button disabled={isLoading} className="btn">{isLoading ? "Сохраняем…" : "Добавить игру"}</button>
        </form>
    )
}
