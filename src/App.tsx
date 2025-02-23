import React, { useEffect, useState } from 'react'

// Определение интерфейсов где type 'Решение должно быть легко расширяемым (например, позволять легко добавлять новые типы параметров – не только текстовые, но например числовые или со списком значений)'
type ParamType = 'string' | 'number' | 'select'

export interface Param {
	id: number
	name: string
	type?: ParamType
}

interface ParamValue {
	paramId: number
	value: string
}

interface Model {
	paramValues: ParamValue[]
	colors: string[] // Предполагаем, что цвета - это массив строк
}

interface Props {
	params: Param[]
	model: Model
}

const ParamEditor: React.FC<Props> = ({ params, model }) => {
	// Состояние для хранения значений параметров
	const [paramValues, setParamValues] = useState<{ [key: number]: string }>({})
	//про цвета ничего не сказано, но раз такая возможность есть, расширю фукнционал компонента по выбору цвета
	const [colorsValues, setColorsValues] = useState<string[]>(model.colors)
	// Инициализация состояния с текущими значениями параметров
	useEffect(() => {
		const initialParamValues: { [key: number]: string } = {}
		model.paramValues.forEach(paramValue => {
			initialParamValues[paramValue.paramId] = paramValue.value
		})
		setParamValues(initialParamValues)
	}, [model.paramValues])

	// Метод для обновления значения параметра
	const handleChange = (paramId: number, value: string) => {
		setParamValues(prevValues => ({
			...prevValues,
			[paramId]: value,
		}))
	}

	//Метод изменения чекбокса цветов
	const handleColorChange = (color: string) => {
		setColorsValues(prevSelectedColors => {
			if (prevSelectedColors.includes(color)) {
				// Если цвет уже выбран, удаляем его из списка
				return prevSelectedColors.filter(c => c !== color)
			} else {
				// Если цвет не выбран, добавляем его в список
				return [...prevSelectedColors, color]
			}
		})
	}

	// Метод для получения полной структуры модели, вывожу в консоль для удобства
	const getModel = (e: React.FormEvent<HTMLFormElement>): Model => {
		e.preventDefault()
		const paramValuesArray = Object.keys(paramValues).map(key => ({
			paramId: Number(key),
			value: paramValues[Number(key)],
		}))
		return {
			paramValues: paramValuesArray,
			colors: colorsValues,
		}
	}

	return (
		<form onSubmit={e => console.log(getModel(e))}>
			<h2>Редактирование параметров товара</h2>
			{params.map(param => (
				<div key={param.id}>
					<label>
						{param.name}:
						{/* Закладываю возможность расширения по типу параметра 'string' */}
						{param.type === 'string' && (
							<input
								type='text'
								value={paramValues[param.id] || ''}
								onChange={e => handleChange(param.id, e.target.value)}
							/>
						)}
						{/* Закладываю возможность расширения по типу параметра 'number' */}
						{param.type === 'number' && (
							<input
								type='number'
								value={paramValues[param.id] || ''}
								onChange={e => handleChange(param.id, e.target.value)}
							/>
						)}
						{/* Закладываю возможность расширения по типу параметра 'select' */}
						{param.type === 'select' && (
							<select
								value={paramValues[param.id] || ''}
								onChange={e => handleChange(param.id, e.target.value)}
							>
								<option value='option1'>Option 1</option>
								<option value='option2'>Option 2</option>
							</select>
						)}
					</label>
				</div>
			))}
			{model.colors.map(color => (
				<div key={color}>
					<label>
						<input
							type='checkbox'
							value={color}
							checked={colorsValues.includes(color)}
							onChange={() => handleColorChange(color)}
						/>
						{color}
					</label>
				</div>
			))}
			<button type='submit'>Получить значения товара в консоли</button>
		</form>
	)
}

const App: React.FC = () => {
	// Пример параметров
	const params: Param[] = [
		{ id: 1, name: 'Назначение', type: 'string' },
		{ id: 2, name: 'Длина', type: 'string' },
		{ id: 3, name: 'Цена', type: 'string' },
	]

	// Пример модели
	const model: Model = {
		paramValues: [
			{ paramId: 1, value: 'повседневное' },
			{ paramId: 2, value: 'макси' },
			{ paramId: 3, value: '100' },
		],
		colors: ['красный', 'синий', 'зеленый'], // Пример цветов
	}

	return (
		<div>
			<h1>Редактор товара</h1>
			<ParamEditor params={params} model={model} />
		</div>
	)
}

export default App
