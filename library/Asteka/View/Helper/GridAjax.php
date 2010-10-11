<?php

/**
 * @package Helper
 */

/**
 * @author Abner S. A. Rizzi <abner.rizzi@gmail.com>
 * @package Helper
 * @subpackage Helper_Grid
 * @version $Id$
 * 
 */

class Asteka_View_Helper_GridAjax extends Zend_View_Helper_Abstract
{

	public $view;
	private $__grid ;

	/**
	 * setView() - set view interface
	 * 
	 * @param Zend_View_Interface $view
	 * @return void
	 */
	public function setView(Zend_View_Interface $view)
	{
		$this->view = $view;
		return $this;
	}

	/**
	 * grid() - set grid model
	 * 
	 * @param Model_Grid $grid
	 * @return string
	 */
	public function gridAjax()
	{

//		$this->setGrid($grid);
		return $this->__headScripts();
	}

	public function __headScripts()
	{


		// Add default script for grid
//		$this->view->headScript()->appendFile($this->getGrid()->getBaseUrl() . '/scripts/grid.js');
		$this->view->headScript()->appendFile($this->getGrid()->getBaseUrl() . '/scripts/gridajax.js');
		$this->view->headScript()->appendFile($this->getGrid()->getBaseUrl() . '/scripts/library/jquery/jquery.text_selection.js');

		// talking value of sort using Front controller getRequest() method.
		$_sort = Zend_Controller_Front::getInstance()->getRequest()->getParam('sort', 'asc');
		$_by = Zend_Controller_Front::getInstance()->getRequest()->getParam('by', 'id');
		$_colSpan = (count($this->getGrid()->getFields())*3);

		// start constructing the grid.
		$output  = '<div id="grid">'."\n";
		$output .= '
<table id="null" border="0" width="800" cellpadding="5" style="border:0px; background-color: #fff;">

<tbody><tr><td></td></tr></tbody>

</table>
</div>
';
		return $output;
		}

	public function __headScriptsOriginal()
	{

		if ($this->getGrid()->getEdit()) {
			$edit = $this->getGrid()->getEdit();
			$editModule = $edit['module'];
			$editAction = $edit['action'];
			$this->view->headScript()->prependScript("var editUrl = '/$editModule/$editAction';");
		}

		// Add default script for grid
		$this->view->headScript()->appendFile($this->getGrid()->getBaseUrl() . '/scripts/grid.js');
		$this->view->headScript()->appendFile($this->getGrid()->getBaseUrl() . '/scripts/library/jquery/jquery.text_selection.js');

		// talking value of sort using Front controller getRequest() method.
		$_sort = Zend_Controller_Front::getInstance()->getRequest()->getParam('sort', 'asc');
		$_by = Zend_Controller_Front::getInstance()->getRequest()->getParam('by', 'id');
		$_colSpan = (count($this->getGrid()->getFields())*3);

		// start constructing the grid.
		$output  = '<div id="grid">'."\n";
		$output .= '
<table id="null" border="0" width="800" cellpadding="5" style="border:0px; background-color: #fff;">

	<tr>
	  <td align="left" width="480"><h3 id="formtitle" style="margin-left: 10px;">'.$this->getGrid()->getName().'</h3></td>
	  <td align="right" colspan="1">';
		if ($this->getGrid()->getAdd()) {
			$add = $this->getGrid()->getAdd();
			$addModule = $add['module'];
			$addAction = $add['action'];
			$output .= '
        <div id="add" class="rfloat">
          <a class="UIButton UIButton_Gray UIActionButton" href="'.$this->getGrid()->getBaseUrl().'/'.$addModule.'/'.$addAction.'">
            <span class="UIButton_Text">
              <span class="UIButton_Icon UIButton_IconNoSpriteMap UIButton_IconSmallMonochromatic" style="background-position: 0pt -361px;">&nbsp;</span>
              Adicionar
            </span>
          </a>
        </div>
			'."\n";
		}
$output .= '</td>
	</tr>

  <tr>
	<td align="center" colspan="3">
	  <table border="0" align="center" cellpadding="0" cellspacing="0" style="border-right: 1px solid #CCCCCC; border-left: 1px solid #919191;" bgcolor="#F7F6F1">

<!-- START OF TABLE HEAD -->
	  <tr class="head">
'."\n"
		;

		for($i=0; $i < count($this->getGrid()->getFields()); $i++ )
		{
			$__fields = $this->getGrid()->getFields();
			$__fields = $__fields[$i];
			$arrow = $this->getGrid()->getBaseUrl(). '/images/grid/';
			if ($this->getGrid()->getSorting()) {
				if ($_by == $__fields->getColum() && $_sort == 'asc') {
					$title = "<a href=\"".$this->view->url(array('sort'=>'desc', 'by'=>$__fields->getColum()))."\">".$__fields->getTitle()."</a>";
					$arrow .= 'arrow_asc_on.gif';
				} elseif ($_by == $__fields->getColum() && $_sort == 'desc') {
					$title = "<a href=\"".$this->view->url(array('sort'=>'asc', 'by'=>$__fields->getColum()))."\">".$__fields->getTitle()."</a>";
					$arrow .= 'arrow_desc_on.gif';
				} else {
					$title = "<a href=\"".$this->view->url(array('sort'=>'asc', 'by'=>$__fields->getColum()))."\">".$__fields->getTitle()."</a>";
					$arrow .= 'arrow_asc_off.gif';
				}
			} else {
				$title = $__fields[$i]['title'];
			}
			$output .= ' 
		  <td width="20" height="20" style="background: url(\''.$this->getGrid()->getBaseUrl().'/images/grid/bg_title.gif\');">
			<img src="'.$arrow.'" alt=""/>
		  </td>

		  <td width="'.$__fields->getSize().'" style="background: url(\''.$this->getGrid()->getBaseUrl().'/images/grid/bg_title.gif\');">
			'.$title.'
		  </td>

		  <td width="0" style="background: url(\''.$this->getGrid()->getBaseUrl().'/images/grid/bg_title.gif\');">
			<img src="'.$this->getGrid()->getBaseUrl().'/images/grid/divisor_title.gif" alt=""/>
		  </td>

'."\n";
		}
		if ($this->getGrid()->getAction()) {
			$output .= '
		  <td align="center" style="background: url(\''.$this->getGrid()->getBaseUrl().'/images/grid/bg_title.gif\');" width="65" >
			A&ccedil;&otilde;es
		  </td>
';
		}
		$output .= '

		</tr>
<!-- END OF TABLE HEAD -->


		<tr>'."\n";


		for($i=0; $i < count($this->getGrid()->getFields()); $i++ ) {
			$__fields = $this->getGrid()->getFields();
			$__fields = $__fields[$i];
			if ($_by == $__fields->getColum()) {
				$output .= '
		  <td height="2" bgcolor="#FF7015"></td>
		  <td bgcolor="#FF7015"></td>
		  <td bgcolor="#FF7015"></td>
				';
			} else {
				$output .= '
		  <td height="2" bgcolor="#BFBDB3"></td>
		  <td bgcolor="#BFBDB3"></td>
		  <td bgcolor="#BFBDB3"></td>
				';
			}
		}
		$output .= '
		</tr>
		';

		if (!$this->getGrid()->getPaginator()->getTotalItemCount()) {
			$output .= '<tr class="row0">
  <td colspan="'.$_colSpan.'" height="4" align="center">* NENHUM REGISTRO ENCONTRADO *</td>
</tr>';
		}
		$i=0;
		foreach ($this->getGrid()->getPaginator() as $post)
		{
			$i++;
			$class = 'row' . ($i%2);
			$output .= '
<tr class="content">
  <td height="2" colspan="'.$_colSpan.'"></td>
</tr>
<tr class="'.$class.'" id="id'.$post['id'].'">
';
			for ($x = 0; $x < count($this->getGrid()->getFields()); $x++)
			{
				$_colum = $this->getGrid()->getFields();
				$_colum = $_colum[$x]->getColum();
				$output .= '
  <td align="center">
	</td>
	';
				if ($x != count($this->getGrid()->getFields())-1) { 
					$output .='
  <td
	>'.utf8_decode($post[$_colum]).'</td>
  <td style="background: url(\''.$this->getGrid()->getBaseUrl().'/images/grid/divisor_content.gif\');"></td>
';
				} else {
					$output .='
  <td colspan="2">'.utf8_decode($post[$_colum]).'</td>
';
				}
			}
			if ($this->getGrid()->getAction()) {
			$output .= '

  <td align="center">';

			if ($this->getGrid()->getEdit()) {
				$edit = $this->getGrid()->getEdit();
				$editModule = $edit['module'];
				$editAction = $edit['action'];
				$output .= '<a href="'.$this->getGrid()->getBaseUrl().'/'.$editModule.'/'.$editAction.'/id/'.$post['id'].'"><img src="'.$this->getGrid()->getBaseUrl().'/images/edit.png" alt=""/></a>'."\n";
			}

			if ($this->getGrid()->getGenealogia()) {
				$genealogia = $this->getGrid()->getGenealogia();
				$genealogiaModule = $genealogia['module'];
				$genealogiaAction = $genealogia['action'];
				$output .= '<a href="'.$this->getGrid()->getBaseUrl().'/'.$genealogiaModule.'/'.$genealogiaAction.'/id/'.$post['id'].'"><img src="'.$this->getGrid()->getBaseUrl().'/images/genealogia_small.gif" alt=""/></a>'."\n";
			}

			if ($this->getGrid()->getDelete()) {
				$delete = $this->getGrid()->getDelete();
				$deleteModule = $delete['module'];
				$deleteAction = $delete['action'];
				$output .= '<a href="#" onclick="check_delete('.$post['id'].', \''.$deleteModule.'\',\''.$this->getGrid()->getBaseUrl().'/'.$deleteModule.'/'.$deleteAction.'\');"><img src="'.$this->getGrid()->getBaseUrl().'/images/trash.png" alt=""/></a>'."\n";
			}

			$output .= '
  </td>
';
			}
			$output .= '</tr>
			';



			if ($this->getGrid()->getPaginator()->getCurrentItemCount() != $i) {
				$output .= '
<tr class="content">
  <td height="2" colspan="'.$_colSpan.'"></td>
</tr>

<tr>
  <td height="1" colspan="'.$_colSpan.'" bgcolor="#BFBDB3"></td>
</tr>
';
			}
		}


		$output .= '
<tr class="content">
  <td colspan="'.$_colSpan.'" height="4"></td>
</tr>

<tr>
  <td height="10" style="background: url(\''.$this->getGrid()->getBaseUrl().'/images/grid/bg_bottom.gif\');" colspan="'.$_colSpan.'"></td>
</tr>

</table>
</td>
  </tr>
<tr><td colspan="3" align="center">

<div class="pagination">
' . $this->view->paginationControl(
	$this->getGrid()->getPaginator(),
	'Elastic',
	'/pagination_control_item.phtml'
);
		$output .= '</div>
</td></tr>
</table>
</div>
<script type="text/javascript">
function highligth(cell, className) {
	cell.parentNode.className = className;
}
</script>
';

		return $output;
	}

	/**
	 * @return the $__grid
	 */
	private final function getGrid() {
		return $this->__grid;
	}

	/**
	 * @param $__grid the $__grid to set
	 */
	private final function setGrid($__grid) {
		$this->__grid = $__grid;
	}

}